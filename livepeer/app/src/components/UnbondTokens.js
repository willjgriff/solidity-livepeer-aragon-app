import React, { useState }  from "react"
import {Button, observe, Text, TextInput} from "@aragon/ui"

const UnbondTokens = ({handleUnbondTokens, unbondingWithdrawRound, currentRound}) => {

    const [unbondTokenCount, setUnbondTokenCount] = useState(0)

    // TODO: Requires a list of unbondingLockId info's
    return (
        <div>
            <TextInput type="number" placeholder="Tokens" onChange={event => setUnbondTokenCount(event.target.value)}/>
            <Button mode="strong" onClick={() => handleUnbondTokens(unbondTokenCount)}>Unbond tokens</Button>
            <Text.Block>Unbond withdraw round for most recent unbond request: {unbondingWithdrawRound} (current round: {currentRound})</Text.Block>
        </div>
    )
}

const UnbondTokensObserve = observe(state$ => state$, {unbondingWithdrawRound: 0, currentRound: 0})(UnbondTokens)

export default UnbondTokensObserve