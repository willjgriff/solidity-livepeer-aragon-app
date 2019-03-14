import React, {useState} from "react"
import {Button, observe, TextInput, Text} from "@aragon/ui"
import {fromDecimals} from '../lib/math-utils'

const ApproveTokens = ({handleApproveTokens, appApprovedTokens}) => {

    const [approveTokenCount, setApproveTokenCount] = useState(0)

    return (
        <div>
            <TextInput type="number" placeholder="Approve Tokens"
                       onChange={event => setApproveTokenCount(event.target.value)}/>
            <Button onClick={() => handleApproveTokens(approveTokenCount)}>Approve tokens for transfer</Button>
            <Text.Block size="normal">Tokens approved for Bonding Manager to spend on behalf of Livepeer
                App: {appApprovedTokens}</Text.Block>
        </div>
    )
}

const ApproveTokensObserve = observe(state$ => state$.map(state => {
    return {
        ...state,
        appApprovedTokens: fromDecimals(state.appApprovedTokens.toString(), 18, false)
    }
}), {appApprovedTokens: 0})(ApproveTokens)

export default ApproveTokensObserve