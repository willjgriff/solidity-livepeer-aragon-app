# solidity-livepeer-aragon-app (WIP)
Aragon app for managing Livepeer actions.

This project uses the Aragon Agent app (Agent.sol) for storing LPT and interacting with Livepeer contracts. 

Initial development includes functions for Livepeer interaction as a typical bonder/delegator. These include the ability to call the functions: approve, bond, claimEarnings, unbond, rebond and withdraw.

Further development will include functions for declaring the app as a transcoder and modifying transcoder variables (reward, fee etc) and integrating voting rights weighted by the amount and time spent bonded to the transcoder. This will also have to include investigation into how to properly incentivize and securely monitor transcoder node operation. A brief discussion can be found here: https://github.com/livepeer/research/issues/13  

## Project contents
### aragon-livepeer-experiment
Initial experimental Solidity tests between the Aragon Agent.sol and the Livepeer BondingManager.sol. See the test file if interested.

### livepeer-protocol
The full livepeer contract deployment for testing locally. Modified to compile with the latest version of Truffle v5.0.6 by swapping `bignumber.js` for `bn.js`. Includes 2 extra truffle scripts:  
`initialiseFirstRound.js` for preparing the BondingManager to be bonded too after initial deployment.  
`skipRoundAndInitialise.js` for skipping a specified number of Livepeer rounds, required for speeding up the system for testing.  

### livepeer
The in development Livepeer Aragon app using the Aragon agent. Uses the Aragon `react-kit` template. Currently includes basic functions including approve, bond, unbond and withdraw. 

## Local Deployment Instructions

Install dependencies:  
```
npm install -g truffle 
npm install -g @aragon/cli 
npm install (In /livepeer directory)
npm install (In /livepeer-protocol directory)
``` 

Startup local chain and IPFS, in separate terminals run:  
```
aragon devchain
aragon ipfs
```

Prepare livepeer contracts, execute these in `/livepeer-protocol` directory:  
```
truffle migrate  
truffle exec scripts/initialiseFirstRound.js
```

Copy the Livepeer Controller address, found during the Livepeer deployment with `truffle migrate` in the `/livepeer-protocol` directory, to the configuration file found at `/livepeer/app/config.js`
  
Deploy Aragon Dao, execute these in the `/livepeer` directory:  
```
npm run start:app (Starts a server hosting the web files for the Livepeer Aragon app)  
npm run start:aragon:http:kit (Publishes the Livepeer Aragon app and deploys an Aragon DAO to the local Ethereum testnet)
```

If the script file is updated it must be rebuilt using this in the `/livepeer` directory:  
```
npm run build:script
```

Before unbonding or withdrawing, you must skip one or more rounds and initialise the latest one. To do this, modify the constants inside as necessary and execute this in the `/livepeer-protocol` directory:
```
truffle exec scripts/skipRoundAndInitialise.js
```