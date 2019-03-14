import React, {useState} from "react"
import {Button, observe, TextInput, Text} from "@aragon/ui"
import {fromDecimals} from "../lib/math-utils";

const BondTokens = ({handleBondTokens, handleApproveAndBond, tokensBonded}) => {

    const [bondTokenCount, setBondTokenCount] = useState(0)
    const [bondToAddress, setBondToAddress] = useState(0)

    return (
        <div>
            <TextInput type="text" wide="true" placeholder="Address"
                       onChange={event => setBondToAddress(event.target.value)}/>

            <TextInput type="number" placeholder="Tokens"
                       onChange={event => setBondTokenCount(event.target.value)}/>

            <Button mode="strong" onClick={() => handleApproveAndBond(bondTokenCount, bondToAddress)}>Approve and bond to
                address</Button>

            <Button onClick={() => handleBondTokens(bondTokenCount, bondToAddress)}>Bond to address</Button>

            <Text.Block>Tokens bonded: {tokensBonded}</Text.Block>
        </div>
    )
}

const BondTokensObserve = observe(state$ =>
    state$.map(state => {
        return {
            ...state,
            tokensBonded: fromDecimals(state.tokensBonded.toString(), 18, false)
        }
    }), {tokensBonded: 0})
(BondTokens)

export default BondTokensObserve