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
            userLptBalance: fromDecimals(userLptBalance, 18, false),
            appsLptBalance: fromDecimals(appsLptBalance, 18, false)
        }
    }
),{})(LivepeerBalance)

export default LivepeerBalanceObserve