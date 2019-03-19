import '@babel/polyfill'
import Aragon from '@aragon/client'
import {livepeerToken$, bondingManager$, roundsManager$, bondingManagerAddress$} from '../web3/ExternalContracts'
import {LIVEPEER_APP_PROXY_ADDRESS} from "../config";
import {of} from 'rxjs/observable/of'
import {range} from 'rxjs/observable/range'

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

const initialState = async (state) => {
    return {
        ...state,
        userLptBalance: await userLptBalance$().toPromise(),
        appsLptBalance: await appLptBalance$().toPromise(),
        appApprovedTokens: await appApprovedTokens$().toPromise(),
        tokensBonded: await tokensBonded$().toPromise(),
        currentRound: await currentRound$().toPromise(),
        unbondingLockInfos: await unbondingLockInfos$().toPromise()
    }
}

//TODO: Add rounds manager events to listen for new round.
const onNewEvent = async (state, {event}) => {
    // console.log("State Update")

    if (state === null) state = defaultState
    switch (event) {
        // TODO: Work out when the store emits, and why it emits lots of events on init (it isn't due to cache/cookies)
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
            console.log("APPROVAL")
            return {
                ...state,
                appApprovedTokens: await appApprovedTokens$().toPromise()
            }
        case 'Bond':
            console.log("BOND")
            return {
                ...state,
                tokensBonded: await tokensBonded$().toPromise(),
                appApprovedTokens: await appApprovedTokens$().toPromise(),
                appsLptBalance: await appLptBalance$().toPromise()
            }
        case 'Unbond':
            console.log("UNBOND")
            return {
                ...state,
                tokensBonded: await tokensBonded$().toPromise(),
                unbondingLockInfos: await unbondingLockInfos$().toPromise()
            }
        default:
            return state
    }
}

app.store(onNewEvent,
    [
        of({event: INITIALISE_EMISSION}),
        livepeerToken$(app).mergeMap(livepeerToken => livepeerToken.events()),
        bondingManager$(app).mergeMap(bondingManager => bondingManager.events())
    ]
)

const userLptBalance$ = () =>
    app.accounts()
        .first()
        .zip(livepeerToken$(app))
        .mergeMap(([accounts, token]) => token.balanceOf(accounts[0]))

const appLptBalance$ = () =>
    livepeerToken$(app)
        .mergeMap(token => token.balanceOf(LIVEPEER_APP_PROXY_ADDRESS))

const appApprovedTokens$ = () =>
    livepeerToken$(app)
        .zip(bondingManagerAddress$(app))
        .mergeMap(([token, bondingManagerAddress]) => token.allowance(LIVEPEER_APP_PROXY_ADDRESS, bondingManagerAddress))

const tokensBonded$ = () =>
    bondingManager$(app)
        .mergeMap(bondingManager => bondingManager.getDelegator(LIVEPEER_APP_PROXY_ADDRESS))
        .map(delegator => delegator.bondedAmount)

const currentRound$ = () =>
    roundsManager$(app)
        .mergeMap(roundsManager => roundsManager.currentRound())

const unbondingLockInfos$ = () =>
    bondingManager$(app)
        .mergeMap(bondingManager =>
            bondingManager.getDelegator(LIVEPEER_APP_PROXY_ADDRESS)
                .mergeMap(delegator => range(0, delegator.nextUnbondingLockId))
                .mergeMap(unbondingLockId => bondingManager.getDelegatorUnbondingLock(LIVEPEER_APP_PROXY_ADDRESS, unbondingLockId)
                    .map(unbondingLockInfo => { return {...unbondingLockInfo, id:unbondingLockId}})))
        .toArray()

