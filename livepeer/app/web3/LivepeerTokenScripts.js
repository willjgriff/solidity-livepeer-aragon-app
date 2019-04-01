import {AbiCoder} from "web3-eth-abi"
import LivepeerTokenApprove from "../abi/livepeerToken-approve.json"
import {toDecimals} from "../src/lib/math-utils";
import {livepeerTokenAddress$, bondingManagerAddress$} from "./ExternalContracts";
import {map, mergeMap, zip} from "rxjs/operators";

const TOKEN_DECIMALS = 18;

const livepeerTokenApprove = (api, tokenCount) => {
    const abiCoder = new AbiCoder()

    bondingManagerAddress$(api).pipe(
        map(bondingManagerAddress => {
            const convertedTokenCount = toDecimals(tokenCount, TOKEN_DECIMALS, false)
            return abiCoder.encodeFunctionCall(LivepeerTokenApprove, [bondingManagerAddress, convertedTokenCount])
        }),
        zip(livepeerTokenAddress$(api)),
        mergeMap(([encodedFunctionCall, tokenAddress]) => api.execute(tokenAddress, 0, encodedFunctionCall))
    ).subscribe()
}

const transferFromApp = (api, sendToAddress, amount) => {
    const adjustedAmount = toDecimals(amount, TOKEN_DECIMALS)

    livepeerTokenAddress$(api).pipe(
        mergeMap(tokenAddress => api.transfer(tokenAddress, sendToAddress, adjustedAmount))
    ).subscribe()
}

const transferToApp = (api, amount) => {
    const adjustedAmount = toDecimals(amount, TOKEN_DECIMALS)

    console.log("HOLA")

    livepeerTokenAddress$(api).pipe(
        mergeMap(tokenAddress => api.deposit(tokenAddress, adjustedAmount, { token: { address: tokenAddress, value: adjustedAmount } }))
    ).subscribe()
}

export {livepeerTokenApprove, transferFromApp, transferToApp}


