import React from "react"
import {Text, Card} from "@aragon/ui"
import styled from 'styled-components'

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
const AddressCard = styled(Card)`
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
    width: auto;
    margin-top: 10px;
    justify-content: space-between;
`
const UserBalance = styled(Text.Block)`
    margin-right: 10px;
`

const LivepeerBalance = ({appState}) => {
    const {appAddress, livepeerTokenAddress, userLptBalance, appsLptBalance} = appState

    return (
        <BalanceContainer>

            <Text.Block weight="bold" size="normal">Livepeer App Address</Text.Block>
            <AddressCard>
                <Text.Block size="normal">{appAddress}</Text.Block>
            </AddressCard>

            <Text.Block weight="bold" size="normal">Livepeer Token Address</Text.Block>
            <AddressCard>
                <Text.Block size="normal">{livepeerTokenAddress}</Text.Block>
            </AddressCard>

            <Text.Block weight="bold" size="normal">Livepeer Token balance</Text.Block>
            <BalancesCard>
                <UserBalance size="normal">User (you): <br/>{userLptBalance} LPT</UserBalance>
                <Text.Block size="normal">Livepeer App:<br/> {appsLptBalance} LPT</Text.Block>
            </BalancesCard>

        </BalanceContainer>
    )
}

export default LivepeerBalance