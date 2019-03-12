import React, { useState } from "react"
import {Button, observe, TextInput, Text} from "@aragon/ui"

const ApproveTokens = ({onApproveTokens, appApprovedTokens}) => {

    const [approveTokenCount, setApproveTokenCount] = useState(0)

    return (
        <div>
            <Text.Block size="normal">Tokens approved for Bonding Manager to spend on behalf of Livepeer App: {appApprovedTokens}</Text.Block>
            <TextInput type="text" onChange={event => setApproveTokenCount(event.target.value)}/>
            <Button onClick={() => onApproveTokens(approveTokenCount)}>Approve tokens for transfer</Button>
        </div>
    )
}

const ApproveTokensObserve = observe(state$ => state$, {appApprovedTokens: 0})(ApproveTokens)

export default ApproveTokensObserve