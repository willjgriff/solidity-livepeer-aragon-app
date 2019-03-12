const Agent = artifacts.require('Agent.sol')

module.exports = function (deployer) {
  deployer.deploy(Agent)
}
