import {BONDING_MANAGER_ADDRESS} from "../config"
import {AbiCoder} from "web3-eth-abi"
import BondingManagerBondAbi from "../abi/bondingManager-bond.json"
import BondingManagerUnbondAbi from "../abi/bondingManager-unbond.json"
import {toDecimals} from "../src/lib/math-utils";

const bondingManagerBond = (app, numberOfTokens, bondToAddress) => {
    const abiCoder = new AbiCoder()

    const convertedTokenCount = toDecimals(numberOfTokens, 18, false)
    const encodedFunctionCall = abiCoder.encodeFunctionCall(BondingManagerBondAbi, [convertedTokenCount, bondToAddress])

    app.execute(BONDING_MANAGER_ADDRESS, 0, encodedFunctionCall)
}

const bondingManagerUnbond = (app, numberOfTokens) => {
    const abiCoder = new AbiCoder()

    const convertedTokenCount = toDecimals(numberOfTokens, 18, false)
    const encodedFunctionCall = abiCoder.encodeFunctionCall(BondingManagerUnbondAbi, [convertedTokenCount])
    
    app.execute(BONDING_MANAGER_ADDRESS, 0, encodedFunctionCall)
}

export { bondingManagerBond, bondingManagerUnbond }
