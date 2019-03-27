import {toDecimals} from "../src/lib/math-utils"
import {livepeerTokenAddress$} from "./ExternalContracts"
import {mergeMap} from "rxjs/operators"

const transferAppsTokens = (api, sendToAddress, amount) => {

    const adjustedAmount = toDecimals(amount, 18)

    livepeerTokenAddress$(api).pipe(
        mergeMap(tokenAddress => api.transfer(tokenAddress, sendToAddress, adjustedAmount)
        )).subscribe()

}

export default transferAppsTokens


