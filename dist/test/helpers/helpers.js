"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.contractId = contractId;
exports.functionSig = functionSig;
exports.functionEncodedABI = functionEncodedABI;

var _ethereumjsUtil = require("ethereumjs-util");

var _ethereumjsUtil2 = _interopRequireDefault(_ethereumjsUtil);

var _ethereumjsAbi = require("ethereumjs-abi");

var _ethereumjsAbi2 = _interopRequireDefault(_ethereumjsAbi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function contractId(name) {
    return _ethereumjsUtil2.default.bufferToHex(_ethereumjsAbi2.default.soliditySHA3(["string"], [name]));
}

function functionSig(name) {
    return _ethereumjsUtil2.default.bufferToHex(_ethereumjsUtil2.default.sha3(name).slice(0, 4));
}

function functionEncodedABI(name, params, values) {
    return _ethereumjsUtil2.default.bufferToHex(Buffer.concat([_ethereumjsUtil2.default.sha3(name).slice(0, 4), _ethereumjsAbi2.default.rawEncode(params, values)]));
}
//# sourceMappingURL=helpers.js.map