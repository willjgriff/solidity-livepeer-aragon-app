import LivepeerTokenApprove from "../abi/livepeerToken-approve.json"
import BondingManagerBondAbi from "../abi/bondingManager-bond.json";
import {AbiCoder} from "web3-eth-abi"
import {toDecimals} from "../src/lib/math-utils";
import {encodeCallScript} from "./utils/evmScript"
import {bondingManagerAddress$, livepeerTokenAddress$} from "./ExternalContracts";
import {map, mergeMap, zip} from "rxjs/operators";

const TOKEN_DECIMALS = 18

//TODO: Remove AbiCoder once we remove this.
const approveAndBond = (api, tokenCount, bondToAddress) => {
    const abiCoder = new AbiCoder()

    const convertedTokenCount = toDecimals(tokenCount, TOKEN_DECIMALS)

    livepeerTokenAddress$(api).pipe(
        zip(bondingManagerAddress$(api)),
        map(([livepeerTokenAddress, bondingManagerAddress]) => {

            console.log(`BondingManager addr: ${bondingManagerAddress} Token count: ${convertedTokenCount} Bond to addr: ${bondToAddress}`)

            const approveEncodedFunctionCall = abiCoder.encodeFunctionCall(LivepeerTokenApprove, [bondingManagerAddress, convertedTokenCount])
            const bondEncodedFunctionCall = abiCoder.encodeFunctionCall(BondingManagerBondAbi, [convertedTokenCount, bondToAddress])

            console.log(`Livepeer token addr: ${livepeerTokenAddress}`)

            const approveAction = {to: livepeerTokenAddress, calldata: approveEncodedFunctionCall}
            const bondAction = {to: bondingManagerAddress, calldata: bondEncodedFunctionCall}

            const encodedCallScript = encodeCallScript([approveAction, bondAction])

            console.log(encodedCallScript)

            return encodedCallScript
        }),
        mergeMap(encodedCallScript => api.forward(encodedCallScript))
    ).subscribe(console.log)
}

export default approveAndBond