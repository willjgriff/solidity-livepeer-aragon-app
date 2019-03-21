import React, {useState} from "react"
import {Button, observe, TextInput, Text, Field, Card} from "@aragon/ui"
import styled from 'styled-components'
import {fromDecimals} from "../lib/math-utils";

const BondTokensContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 30px;
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

const BondTokens = ({handleBondTokens, handleApproveAndBond, bondedAmount, delegateAddress}) => {

    const [bondTokenCount, setBondTokenCount] = useState(0)
    const [bondToAddress, setBondToAddress] = useState(0)

    return (
        <BondTokensContainer>

            <Text.Block size="normal" weight="bold">Bond Tokens</Text.Block>

            <BondedTokensCard>
                <Text.Block>{bondedAmount} LPT bonded to {delegateAddress}</Text.Block>
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
        bondedAmount: fromDecimals(state.delegatorInfo.bondedAmount.toString(), 18),
        delegateAddress: state.delegatorInfo.delegateAddress
    }
}), {delegatorInfo: {}})
(BondTokens)

export default BondTokensObserve