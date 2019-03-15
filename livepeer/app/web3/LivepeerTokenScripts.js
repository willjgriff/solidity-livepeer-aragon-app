import {LIVEPEER_TOKEN_ADDRESS, BONDING_MANAGER_ADDRESS} from "../config"
import {AbiCoder} from "web3-eth-abi"
import LivepeerTokenApprove from "../abi/livepeerToken-approve.json"
import {toDecimals} from "../src/lib/math-utils";

const livepeerTokenApprove = (app, tokenCount) => {
    const abiCoder = new AbiCoder()

    const convertedTokenCount = toDecimals(tokenCount, 18, false)

    console.log(BONDING_MANAGER_ADDRESS + " " + convertedTokenCount)

    const encodedFunctionCall = abiCoder.encodeFunctionCall(LivepeerTokenApprove, [BONDING_MANAGER_ADDRESS, convertedTokenCount])

    app.execute(LIVEPEER_TOKEN_ADDRESS, 0, encodedFunctionCall)
}

export default livepeerTokenApprove


