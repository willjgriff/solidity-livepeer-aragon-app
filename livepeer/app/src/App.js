import React from 'react'
import {Main, AppView} from '@aragon/ui'
import styled from 'styled-components'

import livepeerTokenApprove from "../web3/LivepeerTokenScripts"
import {bondingManagerBond, bondingManagerUnbond, bondingManagerWithdraw} from "../web3/BondingManagerScripts"
import approveAndBond from "../web3/ApproveAndBondScripts"

import LivepeerBalance from "./components/LivepeerTokenBalance"
import ApproveTokens from "./components/ApproveTokens"
import BondTokens from "./components/BondTokens"
import UnbondTokens from "./components/UnbondTokens"

const AppContainer = styled(AppView)`
    display: flex;
    flex-direction: column;
`

const BondBalanceApprovalContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
`

// TODO: Add defaultProps and propTypes to components. Extract strings. Extract common spacing (px values).
export default class App extends React.Component {

    approveTokens = (approveTokenCount) => livepeerTokenApprove(this.props.app, approveTokenCount)

    bondTokens = (tokenCount, bondToAddress) => bondingManagerBond(this.props.app, tokenCount, bondToAddress)

    approveAndBond = (tokenCount, bondToAddress) => approveAndBond(this.props.app, tokenCount, bondToAddress)

    unbondTokens = (tokenCount) => bondingManagerUnbond(this.props.app, tokenCount)

    withdrawTokens = (unbondingLockId) => bondingManagerWithdraw(this.props.app, unbondingLockId)

    render() {
        return (
            <Main>
                <AppContainer title="Livepeer">

                    <BondBalanceApprovalContainer>

                        <LivepeerBalance observable={this.props.observable}/>

                        <ApproveTokens observable={this.props.observable} handleApproveTokens={this.approveTokens}/>

                        <BondTokens observable={this.props.observable} handleBondTokens={this.bondTokens}
                                    handleApproveAndBond={this.approveAndBond}/>

                    </BondBalanceApprovalContainer>

                    <UnbondTokens observable={this.props.observable} handleUnbondTokens={this.unbondTokens}
                                  handleWithdrawTokens={this.withdrawTokens}/>

                </AppContainer>
            </Main>
        )
    }
}