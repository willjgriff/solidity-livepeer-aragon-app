import {toDecimals} from "../src/lib/math-utils";
import {livepeerTokenAddress$} from "./ExternalContracts";
import {mergeMap} from "rxjs/operators";

const TOKEN_DECIMALS = 18;

const livepeerTokenApprove = (api, tokenCount) => {
    const adjustedTokenCount = toDecimals(tokenCount, TOKEN_DECIMALS)
    api.livepeerTokenApprove(adjustedTokenCount)
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

export {livepeerTokenApprove, transferFromApp, transferToApp}