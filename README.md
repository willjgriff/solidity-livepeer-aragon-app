# solidity-livepeer-aragon-app
Aragon app for managing Livepeer actions.

This project uses the Aragon Agent app (Agent.sol) for storing LPT and interacting with Livepeer contracts. 

Initial development includes functions for Livepeer interaction as a typical bonder/delegator. These include the ability to call the functions: approve, bond, claimEarnings, unbond, rebond and withdraw.

Further development will include functions for declaring the app as a transcoder and modifying transcoder variables (reward, fee etc) and integrating voting rights weighted by the amount and time spent bonded to the transcoder. However, this requires further investigation into how to properly incentivize and securely monitor transcoder node operation. A brief discussion can be found here: https://github.com/livepeer/research/issues/13  

## Project contents
### aragon-livepeer-experiment
Initial experimental Solidity tests between the Aragon Agent.sol and the Livepeer BondingManager.sol. See the test file if interested.

### livepeer-protocol
The full livepeer contract deployment for testing locally. Modified to compile with the current version of Truffle v5.0.6. Includes 2 extra truffle scripts:  
- `initialiseFirstRound.js` for preparing the BondingManager to be bonded too after initial deployment.  
- `skipRoundAndInitialise.js` for skipping a specified number of Livepeer rounds, required for speeding up the protocol for testing.  

### livepeer
The in development Livepeer Aragon app using the Agent app. Uses the Aragon `react-kit` template. Currently includes basic functions including approve, bond, unbond, withdraw and transfer. 

## Aragon DAO Rinkeby Installation Instructions

Experimental versions of the Livepeer Aragon app are available on Rinkeby through the aragonPM. 
Using the aragonCLI with access to Rinkeby through the staging environment you can install the current version of this app into an existing Aragon DAO on Rinkeby.  

1. To install the aragonCLI:
    ```sh
    npm install -g @aragon/cli 
    ```  

2. To get access to a staging environment you can download this project and `cd` into `/livepeer` then set the network endpoint and accounts as specified here: https://hack.aragon.org/docs/guides-faq#set-a-private-key.  


Once setup, to see info about the app, including permission roles, contract functions available and current version:
```sh
aragon apm info livepeer.open.aragonpm.eth --environment staging
```  

To install the Livepeer Aragon app into an existing Aragon DAO:  
```sh
dao install <DAO Address> livepeer.open.aragonpm.eth --set-permissions open --environment staging
```
Note the success of this call could be dependant on the permissions set in the DAO. Ensure the account connected can action the Manage Apps permission either directly or through a forwarder eg the Voting app. See Permissions -> Kernal in the UI to check.  


After app installation the permissions can be modified through the UI or through the CLI. Roles available are parameterised and include:  
- EXECUTE_ROLE
- RUN_SCRIPT_ROLE
- TRANSFER_ROLE  

Depending on your set up, they may require parameter permissions to be set to restrict access to certain functions. A preliminary script for modifying parameter permissions can be found at `/livepeer/scripts/grantPermissionWithParameters.js`


## Local Deployment Installation Instructions

1. Install dependencies:  
    ```
    npm install -g truffle 
    npm install -g @aragon/cli 
    npm install (In /livepeer directory)
    npm install (In /livepeer-protocol directory)
    ```

2. Startup local chain and IPFS, in separate terminals run:  
    ```sh
    aragon devchain
    aragon ipfs
    ```

3. Prepare Livepeer contracts, execute in the `/livepeer-protocol` directory:  
    ```sh
    truffle migrate  
    truffle exec scripts/initialiseFirstRound.js
    ```

4. Copy the Livepeer Controller address, found during the Livepeer deployment after `truffle migrate`, to the configuration file found at `/livepeer/app/config.js`
  
5. Deploy the Aragon Dao and Livepeer app, execute in the `/livepeer` directory:  
    ```sh
    aragon run
    ```

Finally, before unbonding or withdrawing, you must skip one or more Livepeer rounds and initialise the latest one. To do this, modify the constants as necessary and execute this in the `/livepeer-protocol` directory:  
```sh
truffle exec scripts/skipRoundAndInitialise.js
```
