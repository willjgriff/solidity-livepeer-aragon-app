# solidity-livepeer-aragon-app (WIP)
Aragon app for managing Livepeer actions.

This project uses the Aragon Agent app (Agent.sol) for storing LPT and interacting with Livepeer contracts. 

Initial development includes functions for Livepeer interaction as a typical bonder/delegator. These include the ability to call the functions: approve (on the Livepeer token), bond, unbond and withdraw.

Further development will include functions for declaring the app as a transcoder and modifying transcoder variables (reward, fee etc) and eventually integrating voting rights weighted at least partly on the amount bonded to the transcoder.

## Project contents
### aragon-livepeer-experiment
Initial experimental Solidity tests between the Aragon Agent.sol and the Livepeer BondingManager.sol.

### livepeer-protocol
The full livepeer contract deployment for testing locally. Modified to compile with the latest version of Truffle v5.0.6 by swapping `bignumber.js` for `bn.js`. Added a script `initialiseFirstRound.js` for preparing the BondingManager to be bonded too.  

### livepeer
The in development Livepeer Aragon app using the Aragon agent. Uses the Aragon `react-kit` template. Currently includes ability to approve tokens and bond to the BondingManager. 

## Local Deployment Instructions

Install dependencies:  
```npm install -g truffle```  
```npm install -g @aragon/cli```  
```npm install``` (In project directory)

Startup local chain and IPFS, in separate terminals run:  
```aragon devchain```  
```aragon ipfs```

Prepare livepeer contracts, execute these in `livepeer-protocol` directory:  
```truffle migrate```  
```truffle exec scripts/initialiseFirstRound.js```

Deploy Aragon Dao, execute these in `livepeer` directory (Note these steps will change in future once the configuration process has been streamlined):  
```npm run start:app``` (Starts a server hosting the web files for the Livepeer Aragon app)  
```npm run start:aragon:http:kit``` (Publishes the Livepeer Aragon app and deploys an Aragon DAO to the local Ethereum testnet)

Copy the following addresses to the configuration file found at `livepeer/app/config.js` (Note this step will be reduced or removed in future):  
Livepeer Controller Address.    
Livepeer Aragon app proxy address found with `dao apps daoAddress` (daoAddress can be found after creating the dao with `npm run start:aragon:http:kit`)

Update the dist script, execute this in `livepeer` (this updates the app hosting server with the updated config.js addresses):  
```npm run build:script```

Before unbonding, you must skip the current round and initialise the next. To do this execute this in `livepeer-protocol` directory:
 ```truffle exec scripts/skipRoundAndInitialise.js```