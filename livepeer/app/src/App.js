import React from 'react'
import { AragonApp, Button, Text, TextInput, observe } from '@aragon/ui'
import styled from 'styled-components'

import livepeerTokenApprove from "../web3/LivepeerTokenScripts"

import LivepeerBalance from "./components/LivepeerTokenBalance"

const AppContainer = styled(AragonApp)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export default class App extends React.Component {

    state = {
        approveTokenCount: 0
    }

    approveTokens = () => livepeerTokenApprove(this.props.app, this.state.approveTokenCount)

    render() {
        return (
            <AppContainer>
                <div>
                    <LivepeerBalance observable={this.props.observable}/>
                    <TextInput type="text" onChange={event => this.setState({approveTokenCount: event.target.value})}/>
                    <Button onClick={this.approveTokens}>Approve tokens for transfer</Button>
                </div>
            </AppContainer>
        )
    }
}

