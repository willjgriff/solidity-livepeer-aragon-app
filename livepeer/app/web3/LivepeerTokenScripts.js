import {AbiCoder} from "web3-eth-abi"
import LivepeerTokenApprove from "../abi/livepeerToken-approve.json"
import {toDecimals} from "../src/lib/math-utils";
import {livepeerTokenAddress$, bondingManagerAddress$} from "./ExternalContracts";
import {map, mergeMap, zip} from "rxjs/operators";

const livepeerTokenApprove = (api, tokenCount) => {
    const abiCoder = new AbiCoder()

    bondingManagerAddress$(api).pipe(
        map(bondingManagerAddress => {
            const convertedTokenCount = toDecimals(tokenCount, 18, false)
            return abiCoder.encodeFunctionCall(LivepeerTokenApprove, [bondingManagerAddress, convertedTokenCount])
        }),
        zip(livepeerTokenAddress$(api)),
        mergeMap(([encodedFunctionCall, tokenAddress]) => api.execute(tokenAddress, 0, encodedFunctionCall))
    ).subscribe()
}

const transferAppsTokens = (api, sendToAddress, amount) => {

    const adjustedAmount = toDecimals(amount, 18)

    livepeerTokenAddress$(api).pipe(
        mergeMap(tokenAddress => api.transfer(tokenAddress, sendToAddress, adjustedAmount))
    ).subscribe()

}

export {livepeerTokenApprove, transferAppsTokens}


