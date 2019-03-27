import {AbiCoder} from "web3-eth-abi"
import BondingManagerBondAbi from "../abi/bondingManager-bond"
import BondingManagerUnbondAbi from "../abi/bondingManager-unbond"
import BondingManagerWithdrawStake from "../abi/bondingManager-withdrawStake"
import {toDecimals} from "../src/lib/math-utils";
import {bondingManagerAddress$} from "./ExternalContracts";
import {mergeMap} from "rxjs/operators";

const bondingManagerBond = (api, numberOfTokens, bondToAddress) => {
    const abiCoder = new AbiCoder()

    const convertedTokenCount = toDecimals(numberOfTokens, 18, false)
    const encodedFunctionCall = abiCoder.encodeFunctionCall(BondingManagerBondAbi, [convertedTokenCount, bondToAddress])

    bondingManagerAddress$(api).pipe(
        mergeMap(bondingManagerAddress => api.execute(bondingManagerAddress, 0, encodedFunctionCall)))
        .subscribe()
}

const bondingManagerUnbond = (api, numberOfTokens) => {
    const abiCoder = new AbiCoder()

    const convertedTokenCount = toDecimals(numberOfTokens, 18, false)
    const encodedFunctionCall = abiCoder.encodeFunctionCall(BondingManagerUnbondAbi, [convertedTokenCount])

    bondingManagerAddress$(api).pipe(
        mergeMap(bondingManagerAddress => api.execute(bondingManagerAddress, 0, encodedFunctionCall)))
        .subscribe()
}

const bondingManagerWithdraw = (api, unbondingLockId) => {
    const abiCoder = new AbiCoder()

    const encodedFunctionCall = abiCoder.encodeFunctionCall(BondingManagerWithdrawStake, [unbondingLockId])

    bondingManagerAddress$(api).pipe(
        mergeMap(bondingManagerAddress => api.execute(bondingManagerAddress, 0, encodedFunctionCall)))
        .subscribe()
}

export {bondingManagerBond, bondingManagerUnbond, bondingManagerWithdraw}
