import LivepeerTokenApprove from "../abi/livepeerToken-approve.json"
import BondingManagerBondAbi from "../abi/bondingManager-bond.json";
import {AbiCoder} from "web3-eth-abi"
import {toDecimals} from "../src/lib/math-utils";
import {encodeCallScript} from "./utils/evmScript"
import {bondingManagerAddress$, livepeerTokenAddress$} from "./ExternalContracts";
import {map, mergeMap, zip} from "rxjs/operators";

const approveAndBond = (api, tokenCount, bondToAddress) => {
    const abiCoder = new AbiCoder()

    const convertedTokenCount = toDecimals(tokenCount, 18, false)

    livepeerTokenAddress$(api).pipe(
        zip(bondingManagerAddress$(api)),
        map(([livepeerTokenAddress, bondingManagerAddress]) => {
            const approveEncodedFunctionCall = abiCoder.encodeFunctionCall(LivepeerTokenApprove, [bondingManagerAddress, convertedTokenCount])
            const bondEncodedFunctionCall = abiCoder.encodeFunctionCall(BondingManagerBondAbi, [convertedTokenCount, bondToAddress])

            const approveAction = {to: livepeerTokenAddress, calldata: approveEncodedFunctionCall}
            const bondAction = {to: bondingManagerAddress, calldata: bondEncodedFunctionCall}

            return encodeCallScript([approveAction, bondAction])
        }),
        mergeMap(encodedCallScript => api.forward(encodedCallScript)))
        .subscribe()
}

export default approveAndBond