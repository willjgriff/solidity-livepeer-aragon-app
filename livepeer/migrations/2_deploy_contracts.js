const LivepeerHack = artifacts.require('LivepeerHack.sol')

module.exports = function (deployer) {
  deployer.deploy(LivepeerHack)
}
