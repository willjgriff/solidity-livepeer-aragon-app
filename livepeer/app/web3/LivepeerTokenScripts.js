import {LivepeerTokenAddress, BondingManagerAddress} from "../config"
import {AbiCoder} from "web3-eth-abi"
import LivepeerTokenApprove from "../abi/livepeerToken-approve.json"

const livepeerTokenApprove = (app, numberOfTokens) => {
    const abiCoder = new AbiCoder()
    const encodedFunctionCall = abiCoder.encodeFunctionCall(LivepeerTokenApprove, [BondingManagerAddress, numberOfTokens])
    app.execute(LivepeerTokenAddress, 0, encodedFunctionCall)
}

export default livepeerTokenApprove


