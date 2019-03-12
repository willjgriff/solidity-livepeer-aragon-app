import '@babel/polyfill'
import Aragon from '@aragon/client'
import LivepeerToken from './web3/LivepeerToken'
import {LivepeerAppProxyAddress} from "./config";
import {of} from 'rxjs/observable/of'

const BN = require("bn.js")

const INITIALISE_EMISSION = Symbol("INITIALISE_APP")
const app = new Aragon()

let appState = {
    count: 0,
    userLptBalance: 0,
    appsLptBalance: 0
}

app.state().subscribe(state => appState = state)

const onNewEvent = async (state, { event }) => {

    console.log("State Update")

    if (state === null) state = appState
    switch (event) {
        case INITIALISE_EMISSION:
        case 'Transfer':
            console.log("TRANSFER")
            return {
                ...appState,
                userLptBalance: await userLptBalance$().toPromise(),
                appsLptBalance: await appsLptBalance$().toPromise()
            }
        case 'Increment':
            // console.log("INCREMENT")
            return {...appState, count: await getValue()}
        case 'Decrement':
            // console.log("DECREMENT")
            return {...appState, count: await getValue()}
        default:
            return state
    }

}

app.store(onNewEvent, [of({event: INITIALISE_EMISSION }), LivepeerToken(app).events()])

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

// TODO: Refactuar
const adjustedBalance = (balance) => (new BN(balance).div(new BN(10).pow(new BN(18)))).toString()

const userLptBalance$ = () =>
    app.accounts()
        .first()
        .mergeMap(accounts => LivepeerToken(app).balanceOf(accounts[0]))
        .map(balance => adjustedBalance(balance))

const appsLptBalance$ = () =>
    LivepeerToken(app).balanceOf(LivepeerAppProxyAddress)
        .map(balance => adjustedBalance(balance))