pragma solidity ^0.4.24;

import "@aragon/apps-agent/contracts/Agent.sol";

contract Livepeer is Agent {

    event AppInitialized();

    function initialize() external onlyInit {
        initialized();
        setDepositable(true);
        emit AppInitialized();
    }

}
