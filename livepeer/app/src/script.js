import '@babel/polyfill'
import Aragon from '@aragon/client'
import {BondingManager, LivepeerToken, LivepeerToken$, BondingManager$} from '../web3/ExternalContracts'
import {LIVEPEER_APP_PROXY_ADDRESS, BONDING_MANAGER_ADDRESS} from "../config";
import {of} from 'rxjs/observable/of'

const INITIALISE_EMISSION = Symbol("INITIALISE_APP")
const app = new Aragon()

let defaultState = {
    userLptBalance: 0,
    appsLptBalance: 0,
    appApprovedTokens: 0,
    tokensBonded: 0,
    unbondingWithdrawRound: 0,
    currentRound: 0
}

const onNewEvent = async (state, {event}) => {
    console.log("State Update")

    if (state === null) state = defaultState
    switch (event) {
        // TODO: Work out when the store emits, and why it emits loads on init, maybe due to cache/cookies?
        case INITIALISE_EMISSION:
            console.log("INITIALISE")
            return await initialState(state)
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
        case 'Unbond':
            console.log("UNBOND EVENT")
            return {
                ...state,
                unbondingWithdrawRound: await unbondingWithdrawRound$().toPromise()
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

// Reminder: if one fails they all fail!
const initialState = async (state) => {
    return {...state,
        userLptBalance: await userLptBalance$().toPromise(),
        appsLptBalance: await appLptBalance$().toPromise(),
        appApprovedTokens: await appApprovedTokens$().toPromise(),
        tokensBonded: await tokensBonded$().toPromise(),
        unbondingInfo: await unbondingWithdrawRound$().toPromise()
    }
}

const userLptBalance$ = () =>
    app.accounts()
        .first()
        .zip(LivepeerToken$(app))
        .mergeMap(([accounts, token]) => token.balanceOf(accounts[0]))

const appLptBalance$ = () =>
    LivepeerToken$(app)
        .mergeMap(token => token.balanceOf(LIVEPEER_APP_PROXY_ADDRESS))

// TODO: Get BondingManagerAddress from observable.
const appApprovedTokens$ = () =>
    LivepeerToken$(app)
        .mergeMap(token => token.allowance(LIVEPEER_APP_PROXY_ADDRESS, BONDING_MANAGER_ADDRESS))

const tokensBonded$ = () =>
    BondingManager$(app)
        .do(asdc => console.log("TOKS BONDO"))
        .mergeMap(bondingManager => bondingManager.getDelegator(LIVEPEER_APP_PROXY_ADDRESS))
        .do(asdc => console.log(asdc))
        .map(delegator => delegator.bondedAmount)

const unbondingWithdrawRound$ = () =>
    BondingManager$(app)
        .mergeMap(bondingManager =>
            bondingManager.getDelegator(LIVEPEER_APP_PROXY_ADDRESS)
                .mergeMap(delegator => bondingManager.getDelegatorUnbondingLock(LIVEPEER_APP_PROXY_ADDRESS, delegator.nextUnbondingLockId)))
        .map(unbondingInfo => unbondingInfo.withdrawRound)

// const currentRound$ = () =>