import React from "react"
import {Text, observe} from "@aragon/ui"

const LivepeerBalance = ({userLptBalance, appsLptBalance}) => {
    return (
        <div>
            <Text.Block size="normal">User LPT balance: {userLptBalance}</Text.Block>
            <Text.Block size="normal">Apps LPT balance: {appsLptBalance}</Text.Block>
        </div>
    )
}

const LivepeerBalanceObserve = observe((state$) => state$, {userLptBalance: 0, appsLptBalance: 0})(LivepeerBalance)

export default LivepeerBalanceObserve