pragma solidity ^0.4.24;

// Had to flatten and manually import the Agent.sol due to npm dependency issues in the Vault.sol contract.
import "./misc/Agent.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";

contract Livepeer is Agent {

    using SafeMath for uint256;

    /// Events
    event Increment(address indexed entity, uint256 step);
    event Decrement(address indexed entity, uint256 step);

    /// State
    uint256 public value;

    /// ACL
    bytes32 constant public INCREMENT_ROLE = keccak256("INCREMENT_ROLE");
    bytes32 constant public DECREMENT_ROLE = keccak256("DECREMENT_ROLE");
//
//    function initialize() onlyInit external {
//        this.Vault.initialize();
//    }

    /**
     * @notice Increment the counter by `step`
     * @param step Amount to increment by
     */
    function increment(uint256 step) auth(INCREMENT_ROLE) external {
        value = value.add(step);
        emit Increment(msg.sender, step);
    }

    /**
     * @notice Decrement the counter by `step`
     * @param step Amount to decrement by
     */
    function decrement(uint256 step) auth(DECREMENT_ROLE) external {
        value = value.sub(step);
        emit Decrement(msg.sender, step);
    }

}