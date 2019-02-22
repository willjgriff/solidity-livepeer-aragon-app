"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rpc = require("./rpc");

var _rpc2 = _interopRequireDefault(_rpc);

var _helpers = require("./helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controller = artifacts.require("Controller");
var GenericMock = artifacts.require("GenericMock");

var Fixture = function () {
    function Fixture(web3) {
        _classCallCheck(this, Fixture);

        this.rpc = new _rpc2.default(web3);
    }

    _createClass(Fixture, [{
        key: "deploy",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return Controller.new();

                            case 2:
                                this.controller = _context.sent;
                                _context.next = 5;
                                return this.deployMocks();

                            case 5:
                                _context.next = 7;
                                return this.controller.unpause();

                            case 7:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function deploy() {
                return _ref.apply(this, arguments);
            }

            return deploy;
        }()
    }, {
        key: "deployMocks",
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.deployAndRegister(GenericMock, "LivepeerToken");

                            case 2:
                                this.token = _context2.sent;
                                _context2.next = 5;
                                return this.deployAndRegister(GenericMock, "Minter");

                            case 5:
                                this.minter = _context2.sent;
                                _context2.next = 8;
                                return this.deployAndRegister(GenericMock, "BondingManager");

                            case 8:
                                this.bondingManager = _context2.sent;
                                _context2.next = 11;
                                return this.deployAndRegister(GenericMock, "RoundsManager");

                            case 11:
                                this.roundsManager = _context2.sent;
                                _context2.next = 14;
                                return this.deployAndRegister(GenericMock, "JobsManager");

                            case 14:
                                this.jobsManager = _context2.sent;
                                _context2.next = 17;
                                return this.deployAndRegister(GenericMock, "Verifier");

                            case 17:
                                this.verifier = _context2.sent;

                            case 18:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function deployMocks() {
                return _ref2.apply(this, arguments);
            }

            return deployMocks;
        }()
    }, {
        key: "deployAndRegister",
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(artifact, name) {
                for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                    args[_key - 2] = arguments[_key];
                }

                var contract, commitHash;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return artifact.new.apply(artifact, _toConsumableArray(args));

                            case 2:
                                contract = _context3.sent;

                                // Use dummy Git commit hash
                                commitHash = "0x123";
                                _context3.next = 6;
                                return this.controller.setContractInfo((0, _helpers.contractId)(name), contract.address, commitHash);

                            case 6:
                                return _context3.abrupt("return", contract);

                            case 7:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function deployAndRegister(_x, _x2) {
                return _ref3.apply(this, arguments);
            }

            return deployAndRegister;
        }()
    }, {
        key: "setUp",
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.rpc.snapshot();

                            case 2:
                                this.currentSnapshotId = _context4.sent;

                            case 3:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function setUp() {
                return _ref4.apply(this, arguments);
            }

            return setUp;
        }()
    }, {
        key: "tearDown",
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.rpc.revert(this.currentSnapshotId);

                            case 2:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function tearDown() {
                return _ref5.apply(this, arguments);
            }

            return tearDown;
        }()
    }]);

    return Fixture;
}();

exports.default = Fixture;
//# sourceMappingURL=Fixture.js.map