import React from 'react'
import { AragonApp } from '@aragon/ui'
import styled from 'styled-components'

import livepeerTokenApprove from "../web3/LivepeerTokenScripts"
import {bondingManagerBond, bondingManagerUnbond} from "../web3/BondingManagerScripts"
import approveAndBond from "../web3/ApproveAndBondScripts"

import LivepeerBalance from "./components/LivepeerTokenBalance"
import ApproveTokens from "./components/ApproveTokens"
import BondTokens from "./components/BondTokens"
import UnbondTokens from "./components/UnbondTokens"

const AppContainer = styled(AragonApp)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export default class App extends React.Component {

    approveTokens = (approveTokenCount) => livepeerTokenApprove(this.props.app, approveTokenCount)

    bondTokens = (tokenCount, bondToAddress) => bondingManagerBond(this.props.app, tokenCount, bondToAddress)

    approveAndBond = (tokenCount, bondToAddress) => approveAndBond(this.props.app, tokenCount, bondToAddress)

    unbondTokens = (tokenCount) => bondingManagerUnbond(this.props.app, tokenCount)

    render() {
        return (
            <AppContainer>
                <div>
                    <LivepeerBalance observable={this.props.observable}/>
                    <hr/>
                    <ApproveTokens observable={this.props.observable} handleApproveTokens={this.approveTokens}/>
                    <hr/>
                    <BondTokens observable={this.props.observable} handleBondTokens={this.bondTokens} handleApproveAndBond={this.approveAndBond}/>
                    <hr/>
                    <UnbondTokens observable={this.props.observable} handleUnbondTokens={this.unbondTokens}/>
                </div>
            </AppContainer>
        )
    }
}

