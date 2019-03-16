import {BONDING_MANAGER_ADDRESS} from "../config"
import {AbiCoder} from "web3-eth-abi"
import BondingManagerBondAbi from "../abi/bondingManager-bond.json"
import BondingManagerUnbondAbi from "../abi/bondingManager-unbond.json"
import {toDecimals} from "../src/lib/math-utils";
import {bondingManagerAddress$} from "./ExternalContracts";

const bondingManagerBond = (app, numberOfTokens, bondToAddress) => {
    const abiCoder = new AbiCoder()

    const convertedTokenCount = toDecimals(numberOfTokens, 18, false)
    const encodedFunctionCall = abiCoder.encodeFunctionCall(BondingManagerBondAbi, [convertedTokenCount, bondToAddress])

    bondingManagerAddress$(app)
        .mergeMap(bondingManagerAddress => app.execute(bondingManagerAddress, 0, encodedFunctionCall))
        .subscribe()
}

const bondingManagerUnbond = (app, numberOfTokens) => {
    const abiCoder = new AbiCoder()

    const convertedTokenCount = toDecimals(numberOfTokens, 18, false)
    const encodedFunctionCall = abiCoder.encodeFunctionCall(BondingManagerUnbondAbi, [convertedTokenCount])

    bondingManagerAddress$(app)
        .mergeMap(bondingManagerAddress => app.execute(bondingManagerAddress, 0, encodedFunctionCall))
        .subscribe()
}

export {bondingManagerBond, bondingManagerUnbond}
