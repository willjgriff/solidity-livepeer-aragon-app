import React, {useState} from "react"
import {Button, observe, Text, TextInput, Field} from "@aragon/ui"
import styled from 'styled-components'
import {fromDecimals} from "../lib/math-utils";
import UnbondingLockItems from "./UnbondingLockItems"

const UnbondTokensContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    padding: 10px;
`

const UnbondInnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    align-items: flex-start;
`

const UnbondInput = styled.div`
    display: flex;
    flex-direction: row;
    margin-right: 10px;
    align-items: center;
`

const UnbondTokenField = styled(Field)`
    margin-right: 20px;
`

const UnbondTokenButton = styled(Button)`
    margin-right: 20px;
`

const UnbondTokens = ({handleUnbondTokens, handleWithdrawTokens, currentRound, unbondingLockInfos}) => {

    const [unbondTokenCount, setUnbondTokenCount] = useState(0)

    return (
        <UnbondTokensContainer>

            <Text.Block weight="bold" size="normal">Unbond Tokens</Text.Block>

            <UnbondInnerContainer>

                <UnbondInput>
                    <UnbondTokenField label="Unbond Tokens:">
                        <TextInput type="number"
                                   onChange={event => setUnbondTokenCount(event.target.value)}/>
                    </UnbondTokenField>

                    <UnbondTokenButton mode="strong" onClick={() => handleUnbondTokens(unbondTokenCount)}>Unbond
                        tokens</UnbondTokenButton>
                </UnbondInput>

                <UnbondingLockItems handleWithdrawTokens={handleWithdrawTokens}
                                    unbondingLockInfos={unbondingLockInfos}
                                    currentRound={currentRound}/>

            </UnbondInnerContainer>
        </UnbondTokensContainer>
    )
}

const UnbondTokensObserve = observe(state$ => state$.map(state => {

    const adjustedUnbondingLockInfo = unbondingLockInfo => {
        return {
            ...unbondingLockInfo,
            amount: fromDecimals(unbondingLockInfo.amount, 18)
        }
    }

    return state === null ? state : {
        ...state,
        unbondingLockInfos: state.unbondingLockInfos.map(adjustedUnbondingLockInfo)
    }
}), {
    currentRound: 0,
    unbondingLockInfos: []
})(UnbondTokens)

export default UnbondTokensObserve