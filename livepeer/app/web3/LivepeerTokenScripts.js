import {LivepeerTokenAddress, BondingManagerAddress} from "../config"
import {AbiCoder} from "web3-eth-abi"
import LivepeerTokenApprove from "../abi/livepeerToken-approve.json"
import {toDecimals} from "../src/lib/math-utils";

const livepeerTokenApprove = (app, tokenCount) => {
    const abiCoder = new AbiCoder()

    const convertedTokenCount = toDecimals(tokenCount, 18, false)
    const encodedFunctionCall = abiCoder.encodeFunctionCall(LivepeerTokenApprove, [BondingManagerAddress, convertedTokenCount])

    app.execute(LivepeerTokenAddress, 0, encodedFunctionCall)
}

export default livepeerTokenApprove


