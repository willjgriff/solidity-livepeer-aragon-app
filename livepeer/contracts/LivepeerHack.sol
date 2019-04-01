pragma solidity ^0.4.24;

import "./Agent.sol";
import "./IController.sol";

/*
 This fairly hacky contract is a workaround for some limitations with the aragonAPI. Firstly, we
 cannot access functions on inherited contracts in the aragonAPI so we need to hoist used functions into this child contract.
 Secondly it enables adding relevant radspec strings to functions that use execute or forward from Agent.sol, which
 can't be customised that much using aragonAPI, specifically it can't currently include the parameter values.
 We also use this child contract to add an initalized event, necessary to get the app's address in the front-end during init.

 LivepeerHack includes references to a modified Agent contract which includes a reference to a modified Vault contract.

 TODO: Pass the livepeerController to the initialize function
 TODO: Get decimal numbers from LPT contract in Radspec strings
 TODO: Remove trailing zeros from fractional token amount
 */
contract LivepeerHack is Agent {

    bytes32 public constant APPROVE_ROLE = keccak256("APPROVE_ROLE");

    event AppInitialized();

    function initialize() external onlyInit {
        initialized();
        setDepositable(true);
        emit AppInitialized();
    }

    /**
    * @notice Execute Approve so the BondingManager can spend
              `_value / 10^18``_value % 10^18 > 0 ? '.' + _value % 10^18 : ''` tokens on behalf of the Livepeer App.
    * @param _livepeerController The LivepeerController address
    * @param _value The amount of tokens to approve
    */
    function livepeerTokenApprove(address _livepeerController, uint256 _value) external auth(APPROVE_ROLE) {

        IController livepeerController = IController(_livepeerController);
        bytes32 livepeerTokenId = keccak256("LivepeerToken");
        address livepeerTokenAddress = livepeerController.getContract(livepeerTokenId);

        bytes32 BondingManagerId = keccak256("BondingManager");
        address bondingManagerAddress = livepeerController.getContract(BondingManagerId);

        string memory functionSignature = "approve(address,uint256)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, bondingManagerAddress, _value);

        _execute(livepeerTokenAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Execute '`@radspec(_target, _data)`' on `_target``_ethValue == 0 ? '' : ' (Sending' + @tokenAmount(_ethValue, 0x00) + ')'`
    * @param _target Address where the action is being executed
    * @param _ethValue Amount of ETH from the contract that is sent with the action
    * @param _data Calldata for the action
    * @return Exits call frame forwarding the return data of the executed call (either error or success data)
    */
    function execute(address _target, uint256 _ethValue, bytes _data)
    external // This function MUST always be external as the function performs a low level return, exiting the Agent app execution context
    authP(EXECUTE_ROLE, arr(_target, _ethValue, uint256(getSig(_data)))) // bytes4 casted as uint256 sets the bytes as the LSBs
    {
        _execute(_target, _ethValue, _data);
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
    * @notice Transfer `_value` `_token` from the Vault to `_to`
    * @param _token Address of the token being transferred
    * @param _to Address of the recipient of tokens
    * @param _value Amount of tokens being transferred
    */
    /* solium-disable-next-line function-order */
    function transfer(address _token, address _to, uint256 _value)
    external
    authP(TRANSFER_ROLE, arr(_token, _to, _value)) {
        _transfer(_token, _to, _value);
    }

    /**
    * @notice Deposit `_value` `_token` to the vault
    * @param _token Address of the token being transferred
    * @param _value Amount of tokens being transferred
    */
    function deposit(address _token, uint256 _value) external payable isInitialized {
        _deposit(_token, _value);
    }
}
