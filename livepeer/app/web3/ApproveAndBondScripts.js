import {LivepeerTokenAddress, BondingManagerAddress} from "../config"
import LivepeerTokenApprove from "../abi/livepeerToken-approve.json"
import BondingManagerBondAbi from "../abi/bondingManager-bond.json";
import {AbiCoder} from "web3-eth-abi"
import {toDecimals} from "../src/lib/math-utils";
import {encodeCallScript} from "../src/lib/evmScript"

const approveAndBond = (app, tokenCount, bondToAddress) => {
    const abiCoder = new AbiCoder()

    const convertedTokenCount = toDecimals(tokenCount, 18, false)

    const approveEncodedFunctionCall = abiCoder.encodeFunctionCall(LivepeerTokenApprove, [BondingManagerAddress, convertedTokenCount])
    const bondEncodedFunctionCall = abiCoder.encodeFunctionCall(BondingManagerBondAbi, [convertedTokenCount, bondToAddress])

    const approveAction = { to: LivepeerTokenAddress, calldata: approveEncodedFunctionCall }
    const bondAction = { to: BondingManagerAddress, calldata: bondEncodedFunctionCall}

    const encodedCallScript = encodeCallScript([approveAction, bondAction])

    app.forward(encodedCallScript)
}

export default approveAndBond