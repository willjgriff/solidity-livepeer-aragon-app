import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {AragonApi} from '@aragon/api-react'
import {fromDecimals} from "./lib/math-utils";

let defaultState = {
    appAddress: "0x0000000000000000000000000000000000000000",
    livepeerTokenAddress: "0x0000000000000000000000000000000000000000",
    userLptBalance: 0,
    appsLptBalance: 0,
    appApprovedTokens: 0,
    delegatorInfo: {bondedAmount: 0, delegateAddress: ""},
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
            userLptBalance: fromDecimals(state.userLptBalance.toString(), 18),
            appsLptBalance: fromDecimals(state.appsLptBalance.toString(), 18),
            appApprovedTokens: fromDecimals(state.appApprovedTokens.toString(), 18),
            delegatorInfo: {
                ...state.delegatorInfo,
                bondedAmount: fromDecimals(state.delegatorInfo.bondedAmount.toString(), 18),
            },
            unbondingLockInfos: state.unbondingLockInfos.map(unbondingLockInfo => {
                return {
                    ...unbondingLockInfo,
                    amount: fromDecimals(unbondingLockInfo.amount, 18)
                }
            })

        }
    }
}

ReactDOM.render(
    <AragonApi reducer={reducer}>
        <App />
    </AragonApi>,
    document.getElementById('root')
)
