import React, {useState} from "react"
import {Button, observe, TextInput, Text, Field, Card} from "@aragon/ui"
import styled from 'styled-components'
import {fromDecimals} from "../lib/math-utils";

const BondTokensContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const BondInputFields = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 10px;
`

const BondedTokensCard = styled(Card)`
    display: flex;
    white-space: nowrap;
    height: auto;
    width: auto;
    padding: 10px;
    margin-top: 10px;
`

const BondButtons = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const BondAndApproveButton = styled(Button)`
    margin-right: 20px;
`

const BondTokensField = styled(Field)`
    margin-right: 20px;
`

const BondToAddressField = styled(Field)`
    width: 100%;
`

const BondTokens = ({handleBondTokens, handleApproveAndBond, tokensBonded}) => {

    const [bondTokenCount, setBondTokenCount] = useState(0)
    const [bondToAddress, setBondToAddress] = useState(0)

    return (
        <BondTokensContainer>

            <Text.Block size="normal" weight="bold">Bonded Tokens</Text.Block>

            <BondedTokensCard>
                <Text.Block>{tokensBonded} LPT bonded to 0x9cdd952fd5d4623de3549ecf6e06a650ec3eda0a</Text.Block>
            </BondedTokensCard>

            <BondInputFields>
                <BondTokensField label="Bond Tokens:">
                    <TextInput type="number"
                               onChange={event => setBondTokenCount(event.target.value)}/>
                </BondTokensField>

                <BondToAddressField label="Bond to Address:">
                    <TextInput wide="true" type="text"
                               onChange={event => setBondToAddress(event.target.value)}/>
                </BondToAddressField>
            </BondInputFields>

            <BondButtons>
                <BondAndApproveButton mode="strong" onClick={() => handleApproveAndBond(bondTokenCount, bondToAddress)}>Approve and
                    bond to address</BondAndApproveButton>

                <Button mode="outline" onClick={() => handleBondTokens(bondTokenCount, bondToAddress)}>Bond to
                    address</Button>
            </BondButtons>

        </BondTokensContainer>
    )
}

const BondTokensObserve = observe(state$ => state$.map(state => {
    return state === null ? state : {
        ...state,
        tokensBonded: fromDecimals(state.tokensBonded.toString(), 18, false)
    }
}), {tokensBonded: 0})
(BondTokens)

export default BondTokensObserve