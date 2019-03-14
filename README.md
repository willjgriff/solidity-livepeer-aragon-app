# solidity-livepeer-aragon-app (WIP)
Aragon app for managing Livepeer actions.

This project uses the Aragon Agent app (Agent.sol) for storing LPT and interacting with Livepeer contracts. 

Initial development includes functions for Livepeer interaction as a typical bonder/delegator. These include the ability to call the functions: approve (on the Livepeer token), bond, unbond and withdraw.

Further development will include functions for declaring the app as a transcoder and modifying transcoder variables (reward, fee etc) and eventually integrating voting rights weighted at least partly on the amount bonded to the transcoder.

## Project contents
#### aragon-livepeer-experiment
Initial experimental Solidity tests between the Aragon Agent.sol and the Livepeer BondingManager.sol.

#### livepeer-protocol
The full livepeer contract deployment for testing locally. Modified to compile with the latest version of Truffle v5.0.6 by swapping `bignumber.js` for `bn.js`. Added a script `initialiseRound.js` for preparing the BondingManager to be bonded too.  

#### livepeer
The in development Livepeer Aragon app using the Aragon agent. Uses the Aragon `react-kit` template. Currently includes ability to approve tokens and bond to the BondingManager. 

Testing and usage instructions to follow soon...
