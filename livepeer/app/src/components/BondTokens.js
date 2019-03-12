import React, {useState} from "react"
import {Button, observe, TextInput, Text} from "@aragon/ui"

const BondTokens = ({handleBondTokens, tokensBonded}) => {

    const [bondTokenCount, setBondTokenCount] = useState(0)
    const [bondToAddress, setBondToAddress] = useState(0)

    return (
        <div>
            <TextInput type="text" wide="true" placeholder="Bond Address"
                       onChange={event => setBondToAddress(event.target.value)}/>
            <TextInput type="number" placeholder="Bond Tokens"
                       onChange={event => setBondTokenCount(event.target.value)}/>
            <Button onClick={() => handleBondTokens(bondTokenCount, bondToAddress)}>Bond tokens to address</Button>

            <Text.Block>Tokens bonded: {tokensBonded}</Text.Block>
        </div>
    )
}

const BondTokensObserve = observe(state$ => state$, {tokensBonded: 0})(BondTokens)

export default BondTokensObserve