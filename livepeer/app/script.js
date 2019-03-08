import '@babel/polyfill'
import Aragon from '@aragon/client'
import LivepeerToken from './external/LivepeerToken'
import {LivepeerAppProxyAddress} from "./config";
const BN = require("bn.js")

const app = new Aragon()

let appState = {
    count: 0,
    userLptBalance: 0,
    appsLptBalance: 0
}

app.state().subscribe(state => {
    appState = state
})

app.store(
    async (state, event) => {
        if (state === null) state = appState

        switch (event.event) {
            case 'Increment':
                console.log("INCREMENT")
                return {...appState, count: await getValue()}
            case 'Decrement':
                console.log("DECREMENT")
                return {...appState, count: await getValue()}
            case 'Transfer':
                console.log("TRANSFER")
                return {
                    ...appState,
                    userLptBalance: await userLptBalance$().toPromise(),
                    appsLptBalance: await appsLptBalance$().toPromise()
                }
            default:
                return state
        }
    },
    [LivepeerToken(app).events()]
)

// Get current value from the contract by calling the public getter
function getValue() {
    return new Promise(resolve => {
        app
            .call('value')
            .first()
            .map(value => parseInt(value, 10))
            .subscribe(resolve)
    })
}

const adjustedBalance = (balance) => (new BN(balance).div(new BN(10).pow(new BN(18)))).toString()

const userLptBalance$ = () =>
    app.accounts()
        .first()
        .mergeMap(accounts => LivepeerToken(app).balanceOf(accounts[0]))
        .map(balance => adjustedBalance(balance))

const appsLptBalance$ = () =>
    LivepeerToken(app).balanceOf(LivepeerAppProxyAddress)
        .map(balance => adjustedBalance(balance))

const loadInitialState = () => {
    userLptBalance$()
        .subscribe(lptBalance => app.cache('state', {...appState, userLptBalance: lptBalance}))
    appsLptBalance$()
        .subscribe(lptBalance => app.cache('state', {...appState, appsLptBalance: lptBalance}))
}

loadInitialState()