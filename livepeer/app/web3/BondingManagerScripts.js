
import {BondingManagerAddress} from "../config"
import {AbiCoder} from "web3-eth-abi"
import BondingManagerBondAbi from "../abi/bondingManager-bond.json"
import {expandTokenCount} from "../src/lib/utils";

const bondingManagerBond = (app, numberOfTokens, bondToAddress) => {
    const abiCoder = new AbiCoder()

    const expandedTokenCount = expandTokenCount(numberOfTokens)
    const encodedFunctionCall = abiCoder.encodeFunctionCall(BondingManagerBondAbi, [expandedTokenCount, bondToAddress])

    app.execute(BondingManagerAddress, 0, encodedFunctionCall)
}

export default bondingManagerBond
