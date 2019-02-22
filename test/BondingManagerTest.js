import Fixture from "../livepeer-protocol/test/unit/helpers/Fixture"
import ethUtil from "ethereumjs-util"

const BondingManager = artifacts.require("BondingManager")
const SortedDoublyLL = artifacts.require("SortedDoublyLL")
const GenericMock = artifacts.require("GenericMock")

contract("BondingManager", accounts => {

    let fixture
    let bondingManager

    const NUM_TRANSCODERS = 5
    const NUM_ACTIVE_TRANSCODERS = 2
    const UNBONDING_PERIOD = 2
    const MAX_EARNINGS_CLAIMS_ROUNDS = 20

    before(async () => {
        fixture = new Fixture(web3)
        await fixture.deploy()

        const sortedDoublyLL = await SortedDoublyLL.new()
        await BondingManager.link("SortedDoublyLL", sortedDoublyLL.address)

        bondingManager = await fixture.deployAndRegister(BondingManager, "BondingManager", fixture.controller.address)

        await bondingManager.setUnbondingPeriod(UNBONDING_PERIOD)
        await bondingManager.setNumTranscoders(NUM_TRANSCODERS)
        await bondingManager.setNumActiveTranscoders(NUM_ACTIVE_TRANSCODERS)
        await bondingManager.setMaxEarningsClaimsRounds(MAX_EARNINGS_CLAIMS_ROUNDS)
    })

    beforeEach(async () => {
        await fixture.setUp()

    })

    afterEach(async () => {
        await fixture.tearDown()
    })


    describe("bond(uint256 _amount, address _to)", () => {

        const transcoder0 = accounts[0]
        const transcoder1 = accounts[1]
        const nonTranscoder = accounts[2]
        const delegator = accounts[3]
        const delegator2 = accounts[4]
        const currentRound = 100

        function functionSig(name) {
            return ethUtil.bufferToHex(ethUtil.sha3(name).slice(0, 4))
        }

        beforeEach(async () => {
            await fixture.roundsManager.setMockBool(functionSig("currentRoundInitialized()"), true)
            await fixture.roundsManager.setMockBool(functionSig("currentRoundLocked()"), false)
            await fixture.roundsManager.setMockUint256(functionSig("currentRound()"), currentRound)

            // console.log(await fixture.token.balanceOf(transcoder0))

            await bondingManager.bond(1000, transcoder0, {from: transcoder0})
            await bondingManager.transcoder(5, 10, 1, {from: transcoder0})
            await bondingManager.bond(2000, transcoder1, {from: transcoder1})
            await bondingManager.transcoder(5, 10, 1, {from: transcoder1})
            await bondingManager.bond(1000, nonTranscoder, {from: nonTranscoder})
        })

        it("it bonds", () => {

        })
    })

})
