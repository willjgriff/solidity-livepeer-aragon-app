import React from "react"
import {Text, observe, Card} from "@aragon/ui"
import styled from 'styled-components'
import {fromDecimals} from "../lib/math-utils";

const BalanceContainer = styled.div`
    margin-right: 30px;
`

const BalancesCard = styled(Card)`
    padding: 10px;
    display: flex;
    flex-direction: row;
    height: auto;
    margin-top: 10px;
    margin-bottom: 20px;
`

const LivepeerBalance = ({userLptBalance, appsLptBalance}) => {
    return (
        <BalanceContainer>
            <Text.Block weight="bold" size="normal">Livepeer Token (LPT) balance</Text.Block>
            <BalancesCard>
                <Text.Block size="normal">User (you): {userLptBalance}</Text.Block>
                <Text.Block size="normal">Livepeer App: {appsLptBalance}</Text.Block>
            </BalancesCard>
        </BalanceContainer>
    )
}

const LivepeerBalanceObserve = observe((state$) => state$.map(state => {
    return state === null ? state : {
        ...state,
        userLptBalance: fromDecimals(state.userLptBalance.toString(), 18, false),
        appsLptBalance: fromDecimals(state.appsLptBalance.toString(), 18, false)
    }
}), {userLptBalance: 0, appsLptBalance: 0})(LivepeerBalance)

export default LivepeerBalanceObserve