import React, { useState }  from "react"
import {Button, observe, Text, TextInput} from "@aragon/ui"

const UnbondTokens = ({handleUnbondTokens, unbondingWithdrawRound, currentRound}) => {

    const [unbondTokenCount, setUnbondTokenCount] = useState(0)

    return (
        <div>
            <TextInput type="number" placeholder="Tokens" onChange={event => setUnbondTokenCount(event.target.value)}/>
            <Button mode="strong" onClick={() => handleUnbondTokens(unbondTokenCount)}>Unbond tokens</Button>
            <Text.Block>Unbond withdraw round: {unbondingWithdrawRound} (current round: {currentRound})</Text.Block>
        </div>
    )
}

const UnbondTokensObserve = observe(state$ => state$, {unbondingWithdrawRound: 0, currentRound: 0})(UnbondTokens)

export default UnbondTokensObserve