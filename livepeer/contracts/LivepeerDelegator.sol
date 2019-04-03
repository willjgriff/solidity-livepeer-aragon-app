pragma solidity ^0.4.24;

import "./Agent.sol";
import "./IController.sol";

/*
 This fairly hacky contract is a workaround for some limitations with Agent.sol and the aragonAPI.
 1) We cannot access functions on inherited contracts in the aragonAPI so we need to hoist some functions into this child contract.
 2) Since we can't set permission params using the UI, necessary to appropriately restrict access to Agent.sol functions, we can create
    custom permissions applied to custom and hoisted functions, which can be modified in the UI.
 3) We use this child contract to add an initialized event, necessary to get the app's address in the front-end during init.
 4) It enables us to add relevant radspec strings to functions that use execute or forward from Agent.sol, which can't be customised
    that much using the aragonAPI. In particular we can't currently include the function parameter values, necessary for voters to see
    details about what they're voting for.

 On a side note this contract also allows us to secure the Livepeer Controller address. If this is specified in the web app and passed in,
  there might be risk of the Livepeer Controller address being changed by an attacker before execution of a function.

 LivepeerDelegator includes a reference to a modified Agent contract which includes a reference to a modified Vault contract.

 TODO: Add function allowing update of Livepeer Controller
 TODO: Get decimal numbers from LPT contract in Radspec strings
 TODO: Remove trailing zeros from fractional token amount (not sure how)
 */
contract LivepeerDelegator is Agent {

    bytes32 public constant APPROVE_ROLE = keccak256("APPROVE_ROLE");
    bytes32 public constant BOND_ROLE = keccak256("BOND_ROLE");
    bytes32 public constant APPROVE_AND_BOND_ROLE = keccak256("APPROVE_AND_BOND_ROLE");
    bytes32 public constant CLAIM_EARNINGS_ROLE = keccak256("CLAIM_EARNINGS_ROLE");
    bytes32 public constant UNBOND_ROLE = keccak256("UNBOND_ROLE");
    bytes32 public constant WITHDRAW_STAKE_ROLE = keccak256("WITHDRAW_STAKE_ROLE");

    IController public livepeerController;

    event AppInitialized();

    /**
    * @notice Initialize the LivepeerHack contract
    * @param _livepeerController The Livepeer Controller contract address
    */
    function initialize(address _livepeerController) external onlyInit {
        initialized();
        livepeerController = IController(_livepeerController);
        setDepositable(true);

        emit AppInitialized();
    }

    /**
    * @notice Approve the Bonding Manager to spend
              `_value / 10^18``_value % 10^18 > 0 ? '.' + _value % 10^18 : ''` tokens from the Livepeer App.
    * @param _value The amount of tokens to approve
    */
    function livepeerTokenApprove(uint256 _value) external auth(APPROVE_ROLE) {
        _livepeerTokenApprove(_value);
    }

    /**
    * @notice Bond `_amount` tokens to `_to`
    * @param _amount The amount of tokens to bond
    * @param _to The address to bond to
    */
    function bond(uint256 _amount, address _to) external auth(BOND_ROLE) {
        _bond(_amount, _to);
    }

    /**
    * @notice Approve and Bond `_amount` tokens to `_to`
    * @param _amount The amount of tokens to approve and bond
    * @param _to The address to bond to
    */
    // TODO: This doesn't work, only executes approve, not bond.
    function approveAndBond(uint256 _amount, address _to) external auth(APPROVE_AND_BOND_ROLE) {
        _livepeerTokenApprove(_amount);
        _bond(_amount, _to);
    }

    /**
    * @notice Claim earnings up to round `_endRound`
    * @param _endRound Last round to claim earnings up to
    */
    function claimEarnings(uint256 _endRound) external auth(CLAIM_EARNINGS_ROLE) {
        bytes32 BondingManagerId = keccak256("BondingManager");
        address bondingManagerAddress = livepeerController.getContract(BondingManagerId);

        string memory functionSignature = "claimEarnings(uint256)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, _endRound);

        _execute(bondingManagerAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Unbond `_amount` tokens
    * @param _amount The amount of tokens to unbond
    */
    function unbond(uint256 _amount) external auth(UNBOND_ROLE) {
        bytes32 BondingManagerId = keccak256("BondingManager");
        address bondingManagerAddress = livepeerController.getContract(BondingManagerId);

        string memory functionSignature = "unbond(uint256)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, _amount);

        _execute(bondingManagerAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Withdraw stake for unbonding lock `_unbondingLockId` to the Livepeer app
    * @param _unbondingLockId The unbonding lock ID
    */
    function withdrawStake(uint256 _unbondingLockId) external auth(WITHDRAW_STAKE_ROLE) {
        bytes32 BondingManagerId = keccak256("BondingManager");
        address bondingManagerAddress = livepeerController.getContract(BondingManagerId);

        string memory functionSignature = "withdrawStake(uint256)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, _unbondingLockId);

        _execute(bondingManagerAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Execute the script as the Agent app
    * @dev IForwarder interface conformance. Forwards any token holder action.
    * @param _evmScript Script being executed
    */
    function forward(bytes _evmScript)
    public
    authP(RUN_SCRIPT_ROLE, arr(getScriptACLParam(_evmScript))) {
        _forward(_evmScript);
    }

    /**
    * @notice Transfer `_value` `_token` from the Livepeer App to `_to`
    * @param _token Address of the token being transferred
    * @param _to Address of the recipient of tokens
    * @param _value Amount of tokens being transferred
    */
    /* solium-disable-next-line function-order */
    function transfer(address _token, address _to, uint256 _value) external authP(TRANSFER_ROLE, arr(_token, _to, _value)) {
        _transfer(_token, _to, _value);
    }

    /**
    * @notice Deposit `_value` `_token` to the Livepeer App
    * @param _token Address of the token being transferred
    * @param _value Amount of tokens being transferred
    */
    function deposit(address _token, uint256 _value) external payable isInitialized {
        _deposit(_token, _value);
    }

    function _livepeerTokenApprove(uint256 _value) internal {
        bytes32 livepeerTokenId = keccak256("LivepeerToken");
        address livepeerTokenAddress = livepeerController.getContract(livepeerTokenId);

        bytes32 BondingManagerId = keccak256("BondingManager");
        address bondingManagerAddress = livepeerController.getContract(BondingManagerId);

        string memory functionSignature = "approve(address,uint256)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, bondingManagerAddress, _value);

        _execute(livepeerTokenAddress, 0, encodedFunctionCall);
    }

    function _bond(uint256 _amount, address _to) internal {
        bytes32 BondingManagerId = keccak256("BondingManager");
        address bondingManagerAddress = livepeerController.getContract(BondingManagerId);

        string memory functionSignature = "bond(uint256,address)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, _amount, _to);

        _execute(bondingManagerAddress, 0, encodedFunctionCall);
    }
}
