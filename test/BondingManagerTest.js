import Fixture from "../livepeer-protocol/test/unit/helpers/Fixture"
import ethUtil from "ethereumjs-util"
import DaoDeployment from "./helpers/DaoDeployment"

const { encodeCallScript } = require('@aragon/test-helpers/evmScript')
const abi = require('ethereumjs-abi')

const BondingManager = artifacts.require("BondingManager")
const SortedDoublyLL = artifacts.require("SortedDoublyLL")
const Agent = artifacts.require("Agent")

contract("BondingManager through Agent", accounts => {

    let fixture, daoDeployment
    let bondingManager, agentBase, agent
    let EXECUTE_ROLE, RUN_SCRIPT_ROLE, ADD_PRESIGNED_HASH_ROLE, DESIGNATE_SIGNER_ROLE

    const NUM_TRANSCODERS = 5
    const NUM_ACTIVE_TRANSCODERS = 2
    const UNBONDING_PERIOD = 2
    const MAX_EARNINGS_CLAIMS_ROUNDS = 20

    const ANY_ADDR = '0xffffffffffffffffffffffffffffffffffffffff'
    const owner = accounts[0]

    before(async () => {
        fixture = new Fixture(web3)
        await fixture.deploy()

        daoDeployment = new DaoDeployment()
        await daoDeployment.deployBefore()

        await deployLinkedList();
        bondingManager = await fixture.deployAndRegister(BondingManager, "BondingManager", fixture.controller.address)
        await setupBondingManager();

        agentBase = await Agent.new()
        await setPermissionConstants(agentBase);
    })

    async function deployLinkedList() {
        const sortedDoublyLL = await SortedDoublyLL.new()
        await BondingManager.link("SortedDoublyLL", sortedDoublyLL.address)
    }

    async function setupBondingManager() {
        await bondingManager.setUnbondingPeriod(UNBONDING_PERIOD)
        await bondingManager.setNumTranscoders(NUM_TRANSCODERS)
        await bondingManager.setNumActiveTranscoders(NUM_ACTIVE_TRANSCODERS)
        await bondingManager.setMaxEarningsClaimsRounds(MAX_EARNINGS_CLAIMS_ROUNDS)
    }

    async function setPermissionConstants(agentBase) {
        EXECUTE_ROLE = await agentBase.EXECUTE_ROLE()
        RUN_SCRIPT_ROLE = await agentBase.RUN_SCRIPT_ROLE()
        ADD_PRESIGNED_HASH_ROLE = await agentBase.ADD_PRESIGNED_HASH_ROLE()
        DESIGNATE_SIGNER_ROLE = await agentBase.DESIGNATE_SIGNER_ROLE()
    }

    beforeEach(async () => {
        await fixture.setUp()
        await daoDeployment.deployBeforeEach(owner)
        await createAgentProxy();
        await createAgentPermissions();
    })

    async function createAgentProxy() {
        const newAppReceipt = await daoDeployment.kernel.newAppInstance('0x1234', agentBase.address)
        agent = await Agent.at(newAppReceipt.logs.filter(log => log.event === 'NewAppProxy')[0].args.proxy)
        await agent.initialize()
    }

    async function createAgentPermissions() {
        await daoDeployment.acl.createPermission(ANY_ADDR, agent.address, EXECUTE_ROLE, owner, {from: owner})
        await daoDeployment.acl.createPermission(ANY_ADDR, agent.address, RUN_SCRIPT_ROLE, owner, {from: owner})
        await daoDeployment.acl.createPermission(ANY_ADDR, agent.address, ADD_PRESIGNED_HASH_ROLE, owner, {from: owner})
        await daoDeployment.acl.createPermission(ANY_ADDR, agent.address, DESIGNATE_SIGNER_ROLE, owner, {from: owner})
    }

    afterEach(async () => {
        await fixture.tearDown()
    })

    describe("bond(uint256 _amount, address _to) through execute(address _target, uint256 _ethValue, bytes _data)", () => {

        const bondRequester = accounts[1]
        const currentRound = 100

        beforeEach(async () => {
            await fixture.roundsManager.setMockBool(functionSig("currentRoundInitialized()"), true)
            await fixture.roundsManager.setMockBool(functionSig("currentRoundLocked()"), false)
            await fixture.roundsManager.setMockUint256(functionSig("currentRound()"), currentRound)
        })

        it("bonds successfully", async () => {
            const expectedTotalDelegated = 1000
            const bondFunction = bondingManager.contract.methods.bond(expectedTotalDelegated, bondRequester).encodeABI()

            await agent.execute(bondingManager.address, 0, bondFunction, { from: bondRequester })

            const actualTotalDelegated = (await bondingManager.getDelegator(bondRequester)).delegatedAmount
            assert.equal(actualTotalDelegated, expectedTotalDelegated)
        })

        it("bonds twice in the same transaction", async () => {
            const expectedTotalDelegated = 1000
            const bondAction = { to: bondingManager.address, calldata: bondingManager.contract.methods.bond(expectedTotalDelegated, bondRequester).encodeABI() }
            const script = encodeCallScript([bondAction])

            await agent.forward(script, { from: bondRequester })

            const actualTotalDelegated = (await bondingManager.getDelegator(bondRequester)).delegatedAmount
            assert.equal(actualTotalDelegated, expectedTotalDelegated * 2)
        })


    })

    const functionSig = (name) => ethUtil.bufferToHex(ethUtil.sha3(name).slice(0, 4))
})
