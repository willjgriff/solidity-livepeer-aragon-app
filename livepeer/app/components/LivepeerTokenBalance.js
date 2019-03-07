import React from "react"
import { Text } from "@aragon/ui"

const LivepeerBalance = (props) => {
    console.log(props)
    return <Text size="normal">Livepeer token balance: {props.tokenBalance}</Text>
}

export { LivepeerBalance }