"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RPC = function () {
    function RPC(web3) {
        _classCallCheck(this, RPC);

        this.web3 = web3;
    }

    _createClass(RPC, [{
        key: "sendAsync",
        value: function sendAsync(method, arg) {
            var _this = this;

            var req = {
                jsonrpc: "2.0",
                method: method,
                id: new Date().getTime()
            };

            if (arg) req.params = arg;

            return new Promise(function (resolve, reject) {
                return _this.web3.currentProvider.sendAsync(req, function (err, result) {
                    if (err) {
                        reject(err);
                    } else if (result && result.error) {
                        reject(new Error("RPC Error: " + (result.error.message || result.error)));
                    } else {
                        resolve(result);
                    }
                });
            });
        }

        // Change block time using TestRPC call evm_setTimestamp
        // https://github.com/numerai/contract/blob/master/test/numeraire.js

    }, {
        key: "increaseTime",
        value: function increaseTime(time) {
            return this.sendAsync("evm_increaseTime", [time]);
        }
    }, {
        key: "mine",
        value: function mine() {
            return this.sendAsync("evm_mine");
        }
    }, {
        key: "snapshot",
        value: function snapshot() {
            return this.sendAsync("evm_snapshot").then(function (res) {
                return res.result;
            });
        }
    }, {
        key: "revert",
        value: function revert(snapshotId) {
            return this.sendAsync("evm_revert", [snapshotId]);
        }
    }, {
        key: "wait",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var blocks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
                var seconds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
                var currentBlock, targetBlock;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.getBlockNumberAsync();

                            case 2:
                                currentBlock = _context.sent;
                                targetBlock = currentBlock + blocks;
                                _context.next = 6;
                                return this.waitUntilBlock(targetBlock, seconds);

                            case 6:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function wait() {
                return _ref.apply(this, arguments);
            }

            return wait;
        }()
    }, {
        key: "waitUntilBlock",
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(targetBlock) {
                var seconds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
                var currentBlock;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.getBlockNumberAsync();

                            case 2:
                                currentBlock = _context2.sent;

                            case 3:
                                if (!(currentBlock < targetBlock)) {
                                    _context2.next = 11;
                                    break;
                                }

                                _context2.next = 6;
                                return this.increaseTime(seconds);

                            case 6:
                                _context2.next = 8;
                                return this.mine();

                            case 8:
                                currentBlock++;
                                _context2.next = 3;
                                break;

                            case 11:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function waitUntilBlock(_x4) {
                return _ref2.apply(this, arguments);
            }

            return waitUntilBlock;
        }()
    }, {
        key: "waitUntilNextBlockMultiple",
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(blockMultiple) {
                var multiples = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
                var seconds = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
                var currentBlock, additionalBlocks;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.getBlockNumberAsync();

                            case 2:
                                currentBlock = _context3.sent;
                                additionalBlocks = (multiples - 1) * blockMultiple;
                                _context3.next = 6;
                                return this.waitUntilBlock(this.nextBlockMultiple(currentBlock, blockMultiple) + additionalBlocks);

                            case 6:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function waitUntilNextBlockMultiple(_x7) {
                return _ref3.apply(this, arguments);
            }

            return waitUntilNextBlockMultiple;
        }()
    }, {
        key: "getBlockNumberAsync",
        value: function getBlockNumberAsync() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                return _this2.web3.eth.getBlockNumber(function (err, blockNum) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(blockNum);
                    }
                });
            });
        }
    }, {
        key: "nextBlockMultiple",
        value: function nextBlockMultiple(currentBlockNum, blockMultiple) {
            if (blockMultiple === 0) {
                return currentBlockNum;
            }

            var remainder = currentBlockNum % blockMultiple;

            if (remainder === 0) {
                return currentBlockNum;
            }

            return currentBlockNum + blockMultiple - remainder;
        }
    }]);

    return RPC;
}();

exports.default = RPC;
//# sourceMappingURL=rpc.js.map