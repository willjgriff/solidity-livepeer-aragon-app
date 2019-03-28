import React from "react"
import {Text, Card} from "@aragon/ui"
import styled from 'styled-components'

const AddressContainer = styled.div`
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

const Addresses = ({handleTransferTokens, appState}) => {
    const {appAddress, livepeerTokenAddress} = appState

    return (
        <AddressContainer>

            <Text.Block weight="bold" size="normal">Livepeer App Address</Text.Block>
            <AddressCard>
                <Text.Block size="normal">{appAddress}</Text.Block>
            </AddressCard>

            <Text.Block weight="bold" size="normal">Livepeer Token Address</Text.Block>
            <AddressCard>
                <Text.Block size="normal">{livepeerTokenAddress}</Text.Block>
            </AddressCard>

        </AddressContainer>
    )
}

export default Addresses