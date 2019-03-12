import React from 'react'
import { AragonApp } from '@aragon/ui'
import styled from 'styled-components'

import livepeerTokenApprove from "../web3/LivepeerTokenScripts"

import LivepeerBalance from "./components/LivepeerTokenBalance"
import ApproveTokens from "./components/ApproveTokens"

const AppContainer = styled(AragonApp)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export default class App extends React.Component {

    state = {
        approveTokenCount: 0
    }

    approveTokens = (approveTokenCount) => livepeerTokenApprove(this.props.app, approveTokenCount)

    render() {
        return (
            <AppContainer>
                <div>
                    <LivepeerBalance observable={this.props.observable}/>
                    <ApproveTokens observable={this.props.observable} onApproveTokens={this.approveTokens}/>
                </div>
            </AppContainer>
        )
    }
}

