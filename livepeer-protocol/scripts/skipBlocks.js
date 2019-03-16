const RPC = require("../utils/rpc").default

const BLOCKS_TO_SKIP = 1000

module.exports = async () => {
    const rpc = new RPC(web3)

    console.log("Current block: " + await rpc.getBlockNumberAsync() + " skipping " + BLOCKS_TO_SKIP + " blocks...")

    await rpc.wait(BLOCKS_TO_SKIP)

    console.log("Blocks skipped, current block: " + await rpc.getBlockNumberAsync())

    process.exit()
}
