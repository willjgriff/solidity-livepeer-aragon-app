import {toDecimals} from "../src/lib/math-utils";

const TOKEN_DECIMALS = 18

const approveAndBond = (api, tokenCount, bondToAddress) => {
    const convertedTokenCount = toDecimals(tokenCount, TOKEN_DECIMALS, false)
    api.approveAndBond(convertedTokenCount, bondToAddress)
        .subscribe()
}

export default approveAndBond