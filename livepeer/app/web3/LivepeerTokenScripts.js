import {LivepeerTokenAddress, BondingManagerAddress} from "../config"
import {AbiCoder} from "web3-eth-abi"
import LivepeerTokenApprove from "../abi/livepeerToken-approve.json"
import {expandTokenCount} from "../src/lib/utils";

const livepeerTokenApprove = (app, numberOfTokens) => {
    const abiCoder = new AbiCoder()

    const expandedTokenCount = expandTokenCount(numberOfTokens)
    const encodedFunctionCall = abiCoder.encodeFunctionCall(LivepeerTokenApprove, [BondingManagerAddress, expandedTokenCount])

    app.execute(LivepeerTokenAddress, 0, encodedFunctionCall)
}

export default livepeerTokenApprove


