"use strict";

var _Fixture = require("./helpers/Fixture");

var _Fixture2 = _interopRequireDefault(_Fixture);

var _expectThrow = require("./helpers/expectThrow");

var _expectThrow2 = _interopRequireDefault(_expectThrow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// import {contractId, functionSig, functionEncodedABI} from "../../utils/helpers"
// import {constants} from "../../utils/constants"

var BondingManager = artifacts.require("BondingManager");
var SortedDoublyLL = artifacts.require("SortedDoublyLL");

// const {DelegatorStatus, TranscoderStatus} = constants


contract("BondingManager", function (accounts) {
    var fixture = void 0;
    var bondingManager = void 0;

    var NUM_TRANSCODERS = 5;
    var NUM_ACTIVE_TRANSCODERS = 2;
    var UNBONDING_PERIOD = 2;
    var MAX_EARNINGS_CLAIMS_ROUNDS = 20;

    var PERC_DIVISOR = 1000000;
    var PERC_MULTIPLIER = PERC_DIVISOR / 100;

    before(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        fixture = new _Fixture2.default(web3);
                        _context.next = 3;
                        return fixture.deploy();

                    case 3:
                        _context.next = 5;
                        return fixture.deployAndRegister(BondingManager, "BondingManager", fixture.controller.address, { gas: 999000000 });

                    case 5:
                        bondingManager = _context.sent;

                    case 6:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }))

    // await bondingManager.setUnbondingPeriod(UNBONDING_PERIOD)
    // await bondingManager.setNumTranscoders(NUM_TRANSCODERS)
    // await bondingManager.setNumActiveTranscoders(NUM_ACTIVE_TRANSCODERS)
    // await bondingManager.setMaxEarningsClaimsRounds(MAX_EARNINGS_CLAIMS_ROUNDS)
    );

    beforeEach(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }))
    // await fixture.setUp()
    );

    afterEach(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }))
    // await fixture.tearDown()
    );

    describe("BondingManager", function () {

        it("does something", _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, undefined);
        })));
    });
});
//# sourceMappingURL=BondingManagerTest.js.map