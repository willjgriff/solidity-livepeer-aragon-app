
import {BondingManagerAddress} from "../config"
import {AbiCoder} from "web3-eth-abi"
import BondingManagerBondAbi from "../abi/bondingManager-bond.json"
import {toDecimals} from "../src/lib/math-utils";

const bondingManagerBond = (app, numberOfTokens, bondToAddress) => {
    const abiCoder = new AbiCoder()

    const expandedTokenCount = toDecimals(numberOfTokens, 18, false)
    const encodedFunctionCall = abiCoder.encodeFunctionCall(BondingManagerBondAbi, [expandedTokenCount, bondToAddress])

    app.execute(BondingManagerAddress, 0, encodedFunctionCall)
}

export default bondingManagerBond
