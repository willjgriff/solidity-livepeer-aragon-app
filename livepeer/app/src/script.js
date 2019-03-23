import '@babel/polyfill'
import Aragon from '@aragon/client'
import {livepeerToken$, bondingManager$, roundsManager$, bondingManagerAddress$} from '../web3/ExternalContracts'
import {LIVEPEER_APP_PROXY_ADDRESS} from "../config";
import {of} from 'rxjs/observable/of'
import {range} from 'rxjs/observable/range'

const INITIALISE_EMISSION = Symbol("INITIALISE_APP")
const app = new Aragon()

//TODO: Add check and button for claimEarnings call.
//TODO: Add rebond functions.
//TODO: Work out how to get the money out! Perhaps we can set the TransferRole permission using the CLI (can't through the UI).
//TODO: Create child contract with functions for each function call to enable radspec strings, transfer function and init with an event.

// Mainly for a complete perspective of the state.
let defaultState = {
    appAddress: "0xABCD...",
    userLptBalance: 0,
    appsLptBalance: 0,
    appApprovedTokens: 0,
    delegatorInfo: {bondedAmount: 0, delegateAddress: ""},
    currentRound: 0,
    unbondingLockInfos: []
}

const initialState = async (state) => {
    return {
        ...state,
        // TODO: Get from an initial event somehow.
        appAddress: LIVEPEER_APP_PROXY_ADDRESS,
        userLptBalance: await userLptBalance$().toPromise(),
        appsLptBalance: await appLptBalance$().toPromise(),
        appApprovedTokens: await appApprovedTokens$().toPromise(),
        delegatorInfo: await delegatorInfo$().toPromise(),
        currentRound: await currentRound$().toPromise(),
        unbondingLockInfos: await unbondingLockInfos$().toPromise()
    }
}

const onNewEvent = async (state, event) => {
    console.log(event)

    if (state === null) state = defaultState
    switch (event.event) {
        // TODO: Work out when the store emits, and why it emits lots of events on init (it isn't due to cache/cookies)
        case INITIALISE_EMISSION:
            console.log("INITIALISE")
            return await initialState(state)
        // case 'Execute':
        //     console.log("EXECUTE")
        //     return {
        //         ...state,
        //         appAddress: event.address
        //     }
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
                delegatorInfo: await delegatorInfo$().toPromise(),
                appApprovedTokens: await appApprovedTokens$().toPromise(),
                appsLptBalance: await appLptBalance$().toPromise()
            }
        case 'Unbond':
            console.log("UNBOND")
            return {
                ...state,
                delegatorInfo: await delegatorInfo$().toPromise(),
                unbondingLockInfos: await unbondingLockInfos$().toPromise()
            }
        case 'NewRound':
            console.log("NEW ROUND")
            return {
                ...state,
                currentRound: await currentRound$().toPromise(),
                unbondingLockInfos: await unbondingLockInfos$().toPromise()
            }
        case 'WithdrawStake':
            console.log("WITHDRAW STAKE")
            return {
                ...state,
                unbondingLockInfos: await unbondingLockInfos$().toPromise(),
                appsLptBalance: await appLptBalance$().toPromise()
            }
        default:
            return state
    }
}

app.store(onNewEvent,
    [
        of({event: INITIALISE_EMISSION}),
        livepeerToken$(app).mergeMap(livepeerToken => livepeerToken.events()),
        bondingManager$(app).mergeMap(bondingManager => bondingManager.events()),
        roundsManager$(app).mergeMap(roundsManager => roundsManager.events())
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

const delegatorInfo$ = () =>
    bondingManager$(app)
        .mergeMap(bondingManager => bondingManager.getDelegator(LIVEPEER_APP_PROXY_ADDRESS))
        .map(delegator => {return {bondedAmount: delegator.bondedAmount, delegateAddress: delegator.delegateAddress}})

const currentRound$ = () =>
    roundsManager$(app)
        .mergeMap(roundsManager => roundsManager.currentRound())

const unbondingLockInfos$ = () =>
    bondingManager$(app)
        .mergeMap(mapBondingManagerToLockInfo)
        .filter(unbondingLockInfo => parseInt(unbondingLockInfo.amount) !== 0)
        .toArray()

const mapBondingManagerToLockInfo = bondingManager =>
    bondingManager.getDelegator(LIVEPEER_APP_PROXY_ADDRESS)
        .zip(currentRound$())
        .mergeMap(([delegator, currentRound]) => range(0, delegator.nextUnbondingLockId)
            .mergeMap(unbondingLockId => bondingManager.getDelegatorUnbondingLock(LIVEPEER_APP_PROXY_ADDRESS, unbondingLockId)
                .map(unbondingLockInfo => {return {...unbondingLockInfo, id: unbondingLockId}}))
            .map(unbondingLockInfo => {return {...unbondingLockInfo, disableWithdraw: parseInt(currentRound) < parseInt(unbondingLockInfo.withdrawRound)}}))

