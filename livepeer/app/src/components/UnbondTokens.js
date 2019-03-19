import React, {useState} from "react"
import {Button, observe, Text, TextInput} from "@aragon/ui"
import {fromDecimals} from "../lib/math-utils";
import UnbondingLockItems from "./UnbondingLockItems"

const UnbondTokens = ({handleUnbondTokens, handleWithdrawTokens, currentRound, unbondingLockInfos}) => {

    const [unbondTokenCount, setUnbondTokenCount] = useState(0)

    return (
        <div>
            <TextInput type="number" placeholder="Tokens" onChange={event => setUnbondTokenCount(event.target.value)}/>
            <Button mode="strong" onClick={() => handleUnbondTokens(unbondTokenCount)}>Unbond tokens</Button>
            <Text>&nbsp;&nbsp;&nbsp;Current round: {currentRound}</Text>
            <UnbondingLockItems handleWithdrawTokens={handleWithdrawTokens} unbondingLockInfos={unbondingLockInfos}/>
        </div>
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