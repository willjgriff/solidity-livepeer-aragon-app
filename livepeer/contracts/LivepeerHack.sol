pragma solidity ^0.4.24;

import "./Agent.sol";

/*
 We use this contract to add an initalized event, necessary to get the app's address in the front-end during init.

 This contract could also be used to generate relevant radspec strings in future, without which
 we would use the template radspec strings on the Agent.sol execute and forward functions. Requires
 further research though.

 This hacked contract is a workaround for the fact that we cannot access functions on inherited contracts in aragonAPI.
 It includes references to a modified Agent contract which includes a reference to a modified Vault contract.
 */
contract LivepeerHack is Agent {

    event AppInitialized();

    function initialize() external onlyInit {
        initialized();
        setDepositable(true);
        emit AppInitialized();
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
        Agent.executeInternal(_target, _ethValue, _data);
    }

    /**
    * @notice Execute the script as the Agent app
    * @dev IForwarder interface conformance. Forwards any token holder action.
    * @param _evmScript Script being executed
    */
    function forward(bytes _evmScript)
    public
    authP(RUN_SCRIPT_ROLE, arr(getScriptACLParam(_evmScript))) {
        Agent.forwardInternal(_evmScript);
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
        Vault.transferInternal(_token, _to, _value);
    }
}
