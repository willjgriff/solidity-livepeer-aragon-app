import '@babel/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import Aragon, {providers} from '@aragon/client'
import App from './App'
import {AragonApi} from '@aragon/api-react'
import {fromDecimals} from "./lib/math-utils";

let defaultState = {
    appAddress: "0x0000000000000000000000000000000000000000",
    livepeerTokenAddress: "0x0000000000000000000000000000000000000000",
    userLptBalance: 0,
    appsLptBalance: 0,
    appApprovedTokens: 0,
    delegatorInfo: {bondedAmount: 0, delegateAddress: ""},
    currentRound: 0,
    unbondingLockInfos: []
}

const reducer = state => {
    if (state === null) {
        return defaultState
    } else {
        return {
            ...state,
            userLptBalance: fromDecimals(state.userLptBalance.toString(), 18),
            appsLptBalance: fromDecimals(state.appsLptBalance.toString(), 18),
            appApprovedTokens: fromDecimals(state.appApprovedTokens.toString(), 18),
            delegatorInfo: {
                ...state.delegatorInfo,
                bondedAmount: fromDecimals(state.delegatorInfo.bondedAmount.toString(), 18),
            },
            unbondingLockInfos: state.unbondingLockInfos.map(unbondingLockInfo => {
                return {
                    ...unbondingLockInfo,
                    amount: fromDecimals(unbondingLockInfo.amount, 18)
                }
            })

        }
    }
}







class ConnectedApp extends React.Component {
    state = {
        app: new Aragon(new providers.WindowMessage(window.parent)),
        observable: null,
        userAccount: '',
    }

    componentDidMount() {
        window.addEventListener('message', this.handleWrapperMessage)

        // If using Parcel, reload instead of using HMR.
        // HMR makes the app disconnect from the wrapper and the state is empty until a reload
        // See: https://github.com/parcel-bundler/parcel/issues/289
        if (module.hot) {
            module.hot.dispose(() => {
                window.location.reload();
            })
        }
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handleWrapperMessage)
    }

    // handshake between Aragon Core and the iframe,
    // since iframes can lose messages that were sent before they were ready
    handleWrapperMessage = ({data}) => {
        if (data.from !== 'wrapper') {
            return
        }
        if (data.name === 'ready') {
            const {app} = this.state
            this.sendMessageToWrapper('ready', true)
            this.setState({
                observable: app.state(),
            })
            app.accounts().subscribe(accounts => {
                this.setState({
                    userAccount: accounts[0],
                })
            })
        }
    }
    sendMessageToWrapper = (name, value) => {
        window.parent.postMessage({from: 'app', name, value}, '*')
    }

    render() {
        return (
            <AragonApi reducer={reducer}>
                <App {...this.state} />
            </AragonApi>
        )
    }
}

ReactDOM.render(
    <ConnectedApp/>,
    document.getElementById('root')
)
