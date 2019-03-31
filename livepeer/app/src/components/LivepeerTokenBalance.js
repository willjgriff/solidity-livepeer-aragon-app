import React, {useState} from "react"
import {Text, Card, TextInput, Button, Field} from "@aragon/ui"
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
const BalancesCard = styled(Card)`
    padding: 10px;
    display: flex;
    flex-direction: row;
    height: auto;
    width: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    justify-content: space-between;
`
const UserBalance = styled(Text.Block)`
    margin-right: 10px;
`
const Transfer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
`
const AddressField = styled(Field)`
    width: auto;
    margin-bottom: 10px;
`
const AmountField = styled(Field)`
    margin-right: 20px;
    margin-bottom: 3px;
`
const TransferButton = styled(Button)`
    margin-bottom: 4px;
`

const LivepeerBalance = ({handleTransferTokens, appState}) => {
    const {userLptBalance, appsLptBalance} = appState

    const [transferAmount, setTransferAmount] = useState(0)
    const [transferAddress, setTransferAddress] = useState(0)

    return (
        <BalanceContainer>

            <Text.Block weight="bold" size="normal">Livepeer Token balance</Text.Block>
            <BalancesCard>
                <UserBalance size="normal">User (you): <br/>{userLptBalance} LPT</UserBalance>
                <Text.Block size="normal">Livepeer App:<br/> {appsLptBalance} LPT</Text.Block>
            </BalancesCard>

            <AddressField label="Address:">
                <TextInput type="text" wide
                           onChange={event => setTransferAddress(event.target.value)}/>
            </AddressField>

            <Transfer>

                <AmountField label="Amount:">
                    <TextInput type="number"
                               onChange={event => setTransferAmount(event.target.value)}/>
                </AmountField>

                <TransferButton mode="strong" onClick={() => handleTransferTokens(transferAddress, transferAmount)}>Transfer Out</TransferButton>

            </Transfer>

        </BalanceContainer>
    )
}

export default LivepeerBalance