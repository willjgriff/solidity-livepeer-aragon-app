import {toDecimals} from "../src/lib/math-utils";

const TOKEN_DECIMALS = 18

const bondingManagerBond = (api, numberOfTokens, bondToAddress) => {
    const convertedTokenCount = toDecimals(numberOfTokens, TOKEN_DECIMALS)
    api.bond(convertedTokenCount, bondToAddress)
        .subscribe()
}

const bondingManagerUnbond = (api, numberOfTokens) => {
    const convertedTokenCount = toDecimals(numberOfTokens, TOKEN_DECIMALS)
    api.unbond(convertedTokenCount)
        .subscribe()
}

const bondingManagerWithdraw = (api, unbondingLockId) => {
    api.withdrawStake(unbondingLockId)
        .subscribe()
}

const bondingManagerClaimEarnings = (api, upToRound) => {
    api.claimEarnings(upToRound)
        .subscribe()
}

export {bondingManagerBond, bondingManagerUnbond, bondingManagerWithdraw, bondingManagerClaimEarnings}
