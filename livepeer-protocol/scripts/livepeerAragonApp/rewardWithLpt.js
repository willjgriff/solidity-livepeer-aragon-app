const Controller = artifacts.require("Controller")
const LivepeerToken = artifacts.require("LivepeerToken")
const AdjustableRoundsManager = artifacts.require("AdjustableRoundsManager")
const BondingManager = artifacts.require("BondingManager")

const BigNumber = require("BigNumber.js")

const {contractId} = require("../../utils/helpers")

const BOND_TO_SELF_AMOUNT = 100000000000000000000 // 100 LPT

module.exports = async () => {
    let controller
    let livepeerToken
    let roundsManager
    let bondingManager

    const transcoderAccount = (await web3.eth.getAccounts())[0]
    const bondToSelfAmount = new BigNumber(BOND_TO_SELF_AMOUNT)

    console.log("Reward with LPT...")

    controller = await Controller.deployed()

    const livepeerTokenAddress = await controller.getContract(contractId("LivepeerToken"))
    livepeerToken = await LivepeerToken.at(livepeerTokenAddress)

    const roundsManagerAddress = await controller.getContract(contractId("RoundsManager"))
    roundsManager = await AdjustableRoundsManager.at(roundsManagerAddress)

    const bondingManagerAddress = await controller.getContract(contractId("BondingManager"))
    bondingManager = await BondingManager.at(bondingManagerAddress)

    const approveReceipt = await livepeerToken.approve(bondingManagerAddress, bondToSelfAmount, {from: transcoderAccount})
    console.log(`Approved ${BOND_TO_SELF_AMOUNT} LPT for bonding manager to spend: ${approveReceipt.tx}`)

    const bondToSelf = await bondingManager.bond(bondToSelfAmount, transcoderAccount)
    console.log(`Bonded ${BOND_TO_SELF_AMOUNT} LPT to self: ${bondToSelf.tx}`)

    const transcoderReceipt = await bondingManager.transcoder(15000, 500000, new BigNumber(150000000000), {from: transcoderAccount}) // 1000000 = 100% (1.5%, 50%, 150 Gwei)
    console.log(`Declare ${transcoderAccount} as transcoder: ${transcoderReceipt.tx}`)

    const roundLength = await roundsManager.roundLength()

    const mineBlocksReceipt = await roundsManager.mineBlocks(roundLength)
    console.log("Skip forward blocks: " + mineBlocksReceipt.tx)

    const initializeRoundTxHash = await roundsManager.initializeRound()
    console.log("Round initialized: " + initializeRoundTxHash.tx)

    const rewardReceipt = await bondingManager.reward({from: transcoderAccount})
    console.log(`Reward called: ${rewardReceipt.tx}`)

    process.exit()
}

