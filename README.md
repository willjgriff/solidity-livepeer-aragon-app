# solidity-livepeer-aragon-app (WIP)
Aragon app for managing Livepeer actions.

This uses the Aragon Agent app so there will likely be very little Solidity involved. This is mainly web app work.

`aragon-livepeer-experiment` includes initial experimental Solidity tests between the Aragon Agent.sol and the Livepeer BondingManager.sol.

`livepeer-protocol` incluces the full livepeer deployment. Currently all contracts are deployable but not configurable when using the latest version of truffle (because is uses bn.js instead of BigNumber.js). This will be fixed when needed.

`livepeer` includes the in development Livepeer Aragon app using the Aragon agent. Uses the Aragon React-Kit template. It's very early stages but will soon include basic BondingManager interaction.
