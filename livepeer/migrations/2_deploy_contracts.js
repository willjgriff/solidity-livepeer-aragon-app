var Livepeer = artifacts.require('Livepeer.sol')

module.exports = function (deployer) {
  deployer.deploy(Livepeer)
}
