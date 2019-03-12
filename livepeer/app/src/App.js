import React from 'react'
import { AragonApp, Button, Text, TextInput, observe } from '@aragon/ui'
import styled from 'styled-components'
import LivepeerBalance from "./components/LivepeerTokenBalance"
// import livepeerTokenApprove from "./contract/LivepeerTokenScripts"
// import LivepeerTokenApprove from "./abi/livepeerToken-approve";
// import {BondingManagerAddress} from "./config";
// import {AbiCoder} from "web3-eth-abi"

const AppContainer = styled(AragonApp)`
  display: flex;
  align-items: center;
  justify-content: center;
`

// const abiCoder = new AbiCoder()
// const encodedFunctionCall = abiCoder.encodeFunctionCall(LivepeerTokenApprove, [BondingManagerAddress, 1])

export default class App extends React.Component {

    // approveTokens = () => livepeerTokenApprove(this.props.app, this.state.approveTokenCount)

    render() {
        return (
            <AppContainer>
                <div>
                    <ObservedCount observable={this.props.observable}/>
                    <Button onClick={() => this.props.app.decrement(1)}>Decrement</Button>
                    <Button onClick={() => this.props.app.increment(1)}>Increment</Button>
                    <LivepeerBalance observable={this.props.observable}/>

                    <TextInput type="text" onChange={event => this.setState({approveTokenCount: event.target.value})}/>
                    <Button onClick={() => console.log("HOLA")}>Approve tokens for transfer</Button>
                </div>
            </AppContainer>
        )
    }
}



const ObservedCount = observe(
    (state$) => state$,
    {count: 0}
)(
    ({count}) => <Text.Block style={{textAlign: 'center'}} size='xxlarge'>{count}</Text.Block>
)

