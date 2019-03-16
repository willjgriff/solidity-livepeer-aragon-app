import {AbiCoder} from "web3-eth-abi"
import LivepeerTokenApprove from "../abi/livepeerToken-approve.json"
import {toDecimals} from "../src/lib/math-utils";
import {livepeerTokenAddress$, bondingManagerAddress$} from "./ExternalContracts";

const livepeerTokenApprove = (app, tokenCount) => {
    const abiCoder = new AbiCoder()

    bondingManagerAddress$(app)
        .map(bondingManagerAddress => {
            const convertedTokenCount = toDecimals(tokenCount, 18, false)
            return abiCoder.encodeFunctionCall(LivepeerTokenApprove, [bondingManagerAddress, convertedTokenCount])
        })
        .zip(livepeerTokenAddress$(app))
        .mergeMap(([encodedFunctionCall, tokenAddress]) => app.execute(tokenAddress, 0, encodedFunctionCall))
        .subscribe()
}

export default livepeerTokenApprove


