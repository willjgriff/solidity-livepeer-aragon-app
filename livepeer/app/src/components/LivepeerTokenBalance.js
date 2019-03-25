import React from "react"
import {Text, observe, Card} from "@aragon/ui"
import styled from 'styled-components'
import {fromDecimals} from "../lib/math-utils";

const BalanceContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 30px;
    margin-bottom: 30px;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: rgb(179,179,179);
    padding: 10px; 
`
const AppAddressCard = styled(Card)`
    padding: 10px;
    height: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    width: auto;
`
const BalancesCard = styled(Card)`
    padding: 10px;
    display: flex;
    flex-direction: row;
    height: auto;
    margin-top: 10px;
    justify-content: space-between;
`

const LivepeerBalance = ({appAddress, userLptBalance, appsLptBalance}) => {
    return (
        <BalanceContainer>

            <Text.Block weight="bold" size="normal">Livepeer App Address</Text.Block>
            <AppAddressCard>
                <Text.Block size="normal">{appAddress}</Text.Block>
            </AppAddressCard>

            <Text.Block weight="bold" size="normal">Livepeer Token (LPT) balance</Text.Block>
            <BalancesCard>
                <Text.Block size="normal">User (you): <br/>{userLptBalance}</Text.Block>
                <Text.Block size="normal">Livepeer App:<br/> {appsLptBalance}</Text.Block>
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
}), {appAddress: "0x0000000000000000000000000000000000000000", userLptBalance: 0, appsLptBalance: 0})(LivepeerBalance)

export default LivepeerBalanceObserve