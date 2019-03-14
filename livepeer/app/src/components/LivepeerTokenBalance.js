import React from "react"
import {Text, observe} from "@aragon/ui"
import {fromDecimals} from "../lib/math-utils";

const LivepeerBalance = ({userLptBalance, appsLptBalance}) => {
    return (
        <div>
            <Text.Block size="normal">User LPT balance: {userLptBalance}</Text.Block>
            <Text.Block size="normal">Apps LPT balance: {appsLptBalance}</Text.Block>
        </div>
    )
}

const LivepeerBalanceObserve = observe((state$) => state$.map(
    state => {
        const {userLptBalance, appsLptBalance} = state
        return {
            ...state,
            userLptBalance: fromDecimals(userLptBalance.toString(), 18, false),
            appsLptBalance: fromDecimals(appsLptBalance.toString(), 18, false)
        }
    }
),{userLptBalance: 0, appsLptBalance: 0})(LivepeerBalance)

export default LivepeerBalanceObserve