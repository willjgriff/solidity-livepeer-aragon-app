# solidity-livepeer-aragon-app (WIP)
Aragon app for managing Livepeer actions.

This project uses the Aragon Agent app (Agent.sol) for storing LPT and interacting with Livepeer contracts. 

Initial development includes functions for Livepeer interaction as a typical bonder/delegator. These include the ability to call the functions: approve (on the Livepeer token), bond, unbond and withdraw.

Further development will include functions for declaring the app as a transcoder and modifying transcoder variables (reward, fee etc) and eventually integrating voting rights weighted at least partly on the amount bonded to the transcoder.

<h5>Project contents</h5>
`aragon-livepeer-experiment` includes initial experimental Solidity tests between the Aragon Agent.sol and the Livepeer BondingManager.sol.  

`livepeer-protocol` incluces the full livepeer contract deployment for testing locally. Modified to compile with the latest version of `Truffle` by swapping `bignumber.js` for `bn.js`. Also added a script `initialiseRound.js` for preparing the BondingManager to be bonded too.  

`livepeer` includes the in development Livepeer Aragon app using the Aragon agent. Uses the Aragon React-Kit template. It's very early stages but will soon include basic BondingManager interaction.  

Testing and usage instructions to follow soon...
