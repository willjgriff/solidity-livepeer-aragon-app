import LivepeerTokenApprove from "../abi/livepeerToken-approve.json"
import BondingManagerBondAbi from "../abi/bondingManager-bond.json";
import {AbiCoder} from "web3-eth-abi"
import {toDecimals} from "../src/lib/math-utils";
import {encodeCallScript} from "./utils/evmScript"
import {bondingManagerAddress$, livepeerTokenAddress$} from "./ExternalContracts";
import {map, mergeMap, zip} from "rxjs/operators";

const approveAndBond = (app, tokenCount, bondToAddress) => {
    const abiCoder = new AbiCoder()

    const convertedTokenCount = toDecimals(tokenCount, 18, false)

    livepeerTokenAddress$(app).pipe(
        zip(bondingManagerAddress$(app)),
        map(([livepeerTokenAddress, bondingManagerAddress]) => {
            const approveEncodedFunctionCall = abiCoder.encodeFunctionCall(LivepeerTokenApprove, [bondingManagerAddress, convertedTokenCount])
            const bondEncodedFunctionCall = abiCoder.encodeFunctionCall(BondingManagerBondAbi, [convertedTokenCount, bondToAddress])

            const approveAction = {to: livepeerTokenAddress, calldata: approveEncodedFunctionCall}
            const bondAction = {to: bondingManagerAddress, calldata: bondEncodedFunctionCall}

            return encodeCallScript([approveAction, bondAction])
        }),
        mergeMap(encodedCallScript => app.forward(encodedCallScript)))
        .subscribe()
}

export default approveAndBond