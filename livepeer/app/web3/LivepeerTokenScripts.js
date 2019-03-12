import {BondingManagerAddress} from "../config"
import {AbiCoder} from "web3-eth-abi"
import LivepeerTokenApprove from "../abi/livepeerToken-approve.json"

const abiCoder = new AbiCoder()

const livepeerTokenApprove = (app, numberOfTokens) => {
    const encodedFunctionCall = abiCoder.encodeFunctionCall(LivepeerTokenApprove, [BondingManagerAddress, numberOfTokens])
    app.execute(BondingManagerAddress, 0, encodedFunctionCall)
        // .subscribe(
        //     transaction => console.log(`Approved ${numberOfTokens} tokens for BondingManager to manage`),
        //     error => console.log()
        // )
}

export default livepeerTokenApprove


