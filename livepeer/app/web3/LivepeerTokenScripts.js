import {AbiCoder} from "web3-eth-abi"
import LivepeerTokenApprove from "../abi/livepeerToken-approve.json"
import {toDecimals} from "../src/lib/math-utils";
import {livepeerTokenAddress$, bondingManagerAddress$} from "./ExternalContracts";
import {map, mergeMap, zip} from "rxjs/operators";
import {CONTROLLER_ADDRESS} from "../config";

const TOKEN_DECIMALS = 18;

const livepeerTokenApprove = (api, tokenCount) => {
    const abiCoder = new AbiCoder()

    bondingManagerAddress$(api).pipe(
        map(bondingManagerAddress => {
            const adjustedTokenCount = toDecimals(tokenCount, TOKEN_DECIMALS)
            return abiCoder.encodeFunctionCall(LivepeerTokenApprove, [bondingManagerAddress, adjustedTokenCount])
        }),
        zip(livepeerTokenAddress$(api)),
        mergeMap(([encodedFunctionCall, tokenAddress]) => api.execute(tokenAddress, 0, encodedFunctionCall))
    ).subscribe()
}

const livepeerTokenApprove2 = (api, tokenCount) => {
    const adjustedTokenCount = toDecimals(tokenCount, TOKEN_DECIMALS)
    api.livepeerTokenApprove(CONTROLLER_ADDRESS, adjustedTokenCount)
        .subscribe()
}

const transferFromApp = (api, sendToAddress, amount) => {
    const adjustedAmount = toDecimals(amount, TOKEN_DECIMALS)

    livepeerTokenAddress$(api).pipe(
        mergeMap(tokenAddress => api.transfer(tokenAddress, sendToAddress, adjustedAmount))
    ).subscribe()
}

const transferToApp = (api, amount) => {
    const adjustedAmount = toDecimals(amount, TOKEN_DECIMALS)

    livepeerTokenAddress$(api).pipe(
        mergeMap(tokenAddress => api.deposit(tokenAddress, adjustedAmount, { token: { address: tokenAddress, value: adjustedAmount } }))
    ).subscribe()
}

export {livepeerTokenApprove, livepeerTokenApprove2, transferFromApp, transferToApp}