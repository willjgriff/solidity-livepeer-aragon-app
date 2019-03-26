pragma solidity ^0.4.24;

import "@aragon/apps-agent/contracts/Agent.sol";

/*
 We use this contract to add an initalized event, necessary to get the app's address in the front-end during init.

 This contract could also be used to generate relevant radspec strings in future, without which
 we would use the template radspec strings on the Agent.sol execute and forward functions. Requires
 further research though.
 */
contract Livepeer is Agent {

    event AppInitialized();

    function initialize() external onlyInit {
        initialized();
        setDepositable(true);
        emit AppInitialized();
    }
}
