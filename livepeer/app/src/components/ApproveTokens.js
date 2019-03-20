import React, {useState} from "react"
import {Button, observe, TextInput, Text, Field, Card, Info} from "@aragon/ui"
import styled from 'styled-components'
import {fromDecimals} from '../lib/math-utils'

const ApproveTokensContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 30px
`
const ApprovedTokensCard = styled(Card)`
    padding: 10px;
    height: auto;
    margin-top: 10px;
`
const ApproveAndButton = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
`
const ApproveInput = styled(Field)`
    margin-right: 20px;
`

const ApproveTokens = ({handleApproveTokens, appApprovedTokens}) => {

    const [approveTokenCount, setApproveTokenCount] = useState(0)

    return (
        <ApproveTokensContainer>
            <Text.Block size="normal" weight="bold">Bonding Manager Approved Tokens</Text.Block>

            <ApprovedTokensCard>
                <Text.Block size="normal">{appApprovedTokens}</Text.Block>
            </ApprovedTokensCard>

            <ApproveAndButton>

                <ApproveInput label="Approve Tokens:">
                    <TextInput type="number"
                               onChange={event => setApproveTokenCount(event.target.value)}/>
                </ApproveInput>

                <Button mode="outline" onClick={() => handleApproveTokens(approveTokenCount)}>Approve Tokens</Button>

            </ApproveAndButton>
        </ApproveTokensContainer>
    )
}

const ApproveTokensObserve = observe(state$ => state$.map(state => {
    return state === null ? state : {
        ...state,
        appApprovedTokens: fromDecimals(state.appApprovedTokens.toString(), 18, false)
    }
}), {appApprovedTokens: 0})(ApproveTokens)

export default ApproveTokensObserve