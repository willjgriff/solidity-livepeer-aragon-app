"use strict";

var SortedDoublyLL = artifacts.require("SortedDoublyLL");
var BondingManager = artifacts.require("BondingManager");

module.exports = function (deployer) {
    deployer.deploy(SortedDoublyLL);
    deployer.link(SortedDoublyLL, BondingManager);
};
//# sourceMappingURL=2_deploy_libraries.js.map