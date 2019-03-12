import '@babel/polyfill'
import Aragon from '@aragon/client'
import LivepeerToken from './web3/LivepeerToken'
import {LivepeerAppProxyAddress, BondingManagerAddress} from "./config";
import {of} from 'rxjs/observable/of'
import { reduceTokenCount } from './src/utils'

const INITIALISE_EMISSION = Symbol("INITIALISE_APP")
const app = new Aragon()

let appState = {
    count: 0,
    userLptBalance: 0,
    appsLptBalance: 0,
    appApprovedTokens: 0
}

app.state().subscribe(state => appState = state)

const onNewEvent = async (state, {event}) => {

    console.log("State Update")
    console.log(event)

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
        case 'Approval':
            console.log("TOKS: " + await appApprovedTokens$().toPromise())
            return {
                ...appState,
                appApprovedTokens: await appApprovedTokens$().toPromise()
            }
        default:
            return state
    }
}

app.store(onNewEvent, [of({event: INITIALISE_EMISSION}), LivepeerToken(app).events()])


// TODO: Move the below somewhere ALSO make it so fractional values can be represented... Also maybe do conversion in the observe functions.
const userLptBalance$ = () =>
    app.accounts()
        .first()
        .mergeMap(accounts => LivepeerToken(app).balanceOf(accounts[0]))
        .map(reduceTokenCount)

const appsLptBalance$ = () =>
    LivepeerToken(app).balanceOf(LivepeerAppProxyAddress)
        .map(reduceTokenCount)

const appApprovedTokens$ = () =>
    LivepeerToken(app).allowance(LivepeerAppProxyAddress, BondingManagerAddress)
        .map(reduceTokenCount)