import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {AragonApi} from '@aragon/api-react'
import {fromDecimals} from "./lib/math-utils";

const TOKEN_DECIMALS = 18;

let defaultState = {
    appAddress: "0x0000000000000000000000000000000000000000",
    livepeerTokenAddress: "0x0000000000000000000000000000000000000000",
    userLptBalance: 0,
    appsLptBalance: 0,
    appApprovedTokens: 0,
    delegatorInfo: {bondedAmount: 0, delegateAddress: "", lastClaimRound: 0, pendingStake: 0},
    currentRound: 0,
    disableUnbondTokens: false,
    unbondingLockInfos: []
}

const reducer = state => {
    if (state === null) {
        return defaultState
    } else {
        return {
            ...state,
            userLptBalance: fromDecimals(state.userLptBalance.toString(), TOKEN_DECIMALS),
            appsLptBalance: fromDecimals(state.appsLptBalance.toString(), TOKEN_DECIMALS),
            appApprovedTokens: fromDecimals(state.appApprovedTokens.toString(), TOKEN_DECIMALS),
            delegatorInfo: {
                ...state.delegatorInfo,
                totalStake: calculateTotalStake(state.delegatorInfo)
            },
            unbondingLockInfos: state.unbondingLockInfos.map(unbondingLockInfo => {
                return {
                    ...unbondingLockInfo,
                    amount: fromDecimals(unbondingLockInfo.amount, TOKEN_DECIMALS)
                }
            })
        }
    }
}

//TODO: Fix the null check.
const calculateTotalStake = (delegatorInfo) => {
    const bondedAmount = fromDecimals(delegatorInfo.bondedAmount.toString(), TOKEN_DECIMALS)
    const pendingStake = fromDecimals(delegatorInfo.pendingStake ? delegatorInfo.pendingStake.toString() : "0", TOKEN_DECIMALS)

    return Math.max(bondedAmount, pendingStake)
}

ReactDOM.render(
    <AragonApi reducer={reducer}>
        <App />
    </AragonApi>,
    document.getElementById('root')
)
