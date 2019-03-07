import '@babel/polyfill'
import Aragon from '@aragon/client'
import LivepeerTokenAbi from './abi/LivepeerTokenAbi.json'
import {LivepeerTokenAddress} from "./config";

const app = new Aragon()

let appState = {
    count: 0,
    tokenBalance: 0
}

app.store(async (state, event) => {
    if (state === null) state = appState

    switch (event.event) {
        case 'Increment':
            console.log("INCREMENT")
            return {...appState, count: await getValue()}
        case 'Decrement':
            console.log("DECREMENT")
            return {...appState, count: await getValue()}
        default:
            return state
    }
})

// app.state().subscribe(state => {
//     console.log("STATE")
//     console.log(state)
//     appState = state
// })

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

const loadInitialState = () => {
    const livepeerToken = app.external(LivepeerTokenAddress, LivepeerTokenAbi)
    app.accounts()
        .first()
        .mergeMap(accounts => livepeerToken.balanceOf(accounts[0]))
        .subscribe(lptBalance => { app.cache('state', {...appState, tokenBalance: lptBalance })})
}

loadInitialState()