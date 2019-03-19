const Controller = artifacts.require("Controller")
const AdjustableRoundsManager = artifacts.require("AdjustableRoundsManager")

const {contractId} = require("../utils/helpers")

module.exports = async () => {
    let controller
    let roundsManager

    console.log("Skipping current round...")

    controller = await Controller.deployed()

    const roundsManagerAddr = await controller.getContract(contractId("RoundsManager"))
    roundsManager = await AdjustableRoundsManager.at(roundsManagerAddr)

    const roundLength = await roundsManager.roundLength()

    const mineBlocksReceipt = await roundsManager.mineBlocks(roundLength)
    console.log("Skip forward blocks: " + mineBlocksReceipt.tx)

    const initializeRoundTxHash = await roundsManager.initializeRound()
    console.log("Round initialized: " + initializeRoundTxHash.tx)

    process.exit()
}

