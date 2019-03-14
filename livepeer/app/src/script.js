import '@babel/polyfill'
import Aragon from '@aragon/client'
import LivepeerToken from '../web3/LivepeerToken'
import BondingManager from '../web3/BondingManager'
import {LivepeerAppProxyAddress, BondingManagerAddress} from "../config";
import {of} from 'rxjs/observable/of'

const INITIALISE_EMISSION = Symbol("INITIALISE_APP")
const app = new Aragon()

let initialState = {
    userLptBalance: 0,
    appsLptBalance: 0,
    appApprovedTokens: 0,
    tokensBonded: 0
}

const onNewEvent = async (state, {event}) => {

    console.log("State Update")
    console.log(event)

    if (state === null) state = initialState
    switch (event) {
        // TODO: Work out when the store emits, and why it emits loads on init, maybe due to cache/cookies?
        case INITIALISE_EMISSION:
        case 'Transfer':
            console.log("TRANSFER")
            return {
                ...state,
                userLptBalance: await userLptBalance$().toPromise(),
                appsLptBalance: await appLptBalance$().toPromise()
            }
        case 'Approval':
            console.log("TOKS: " + await appApprovedTokens$().toPromise())
            return {
                ...state,
                appApprovedTokens: await appApprovedTokens$().toPromise()
            }
        case 'Bond':
            console.log("BOND EVENT")
            return {
                ...state,
                tokensBonded: await tokensBonded$().toPromise(),
                appApprovedTokens: await appApprovedTokens$().toPromise(),
                appsLptBalance: await appLptBalance$().toPromise()

            }
        default:
            return state
    }
}

app.store(onNewEvent,
    [
        of({event: INITIALISE_EMISSION}),
        LivepeerToken(app).events(),
        BondingManager(app).events()
    ]
)


// TODO: Move the below somewhere ALSO make it so fractional values can be represented... Also maybe do conversion in the observe functions.
const userLptBalance$ = () =>
    app.accounts()
        .first()
        .mergeMap(accounts => LivepeerToken(app).balanceOf(accounts[0]))

const appLptBalance$ = () =>
    LivepeerToken(app).balanceOf(LivepeerAppProxyAddress)

const appApprovedTokens$ = () =>
    LivepeerToken(app).allowance(LivepeerAppProxyAddress, BondingManagerAddress)

const tokensBonded$ = () =>
    BondingManager(app).getDelegator(LivepeerAppProxyAddress)
        .map(delegator => delegator.bondedAmount)
