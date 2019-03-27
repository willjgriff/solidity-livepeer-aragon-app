import '@babel/polyfill'
import AragonApi from '@aragon/api'
import {livepeerTokenAddress$, livepeerToken$, bondingManagerAddress$, bondingManager$, roundsManager$} from '../web3/ExternalContractsNEW'
import {of, range, zip} from "rxjs";
import {first, mergeMap, map, filter, toArray} from "rxjs/operators"

const INITIALISE_EMISSION = Symbol("INITIALISE_APP")
const api = new AragonApi()
let livepeerAppAddress = "0x0000000000000000000000000000000000000000"

//TODO: Add check and button for claimEarnings call.
//TODO: Add rebond functions.
//TODO: Work out how to get the money out! Perhaps we can set the TransferRole permission using the CLI (can't through the UI).
//TODO: Create child contract with functions for each function call to enable radspec strings, transfer function and init with an event.

const initialState = async (state) => {
    return {
        ...state,
        livepeerTokenAddress: await livepeerTokenAddress$(api).toPromise(),
        userLptBalance: await userLptBalance$().toPromise(),
        appsLptBalance: await appLptBalance$().toPromise(),
        appApprovedTokens: await appApprovedTokens$().toPromise(),
        delegatorInfo: await delegatorInfo$().toPromise(),
        currentRound: await currentRound$().toPromise(),
        unbondingLockInfos: await unbondingLockInfos$().toPromise()
    }
}

const onNewEvent = async (state, event) => {

    switch (event.event) {
        // TODO: Work out when the store emits, and why it emits lots of events on init (it isn't due to cache/cookies)
        //  then sort out storing of the app address for the script. Is currently confusing and potentially unreliable.
        case INITIALISE_EMISSION:
            console.log("INITIALISE")
            return await initialState(state)
        case 'Execute':
        case 'AppInitialized':
            console.log("APP INITIALIZED OR EXECUTE")
            livepeerAppAddress = event.address

            const initState = await initialState(state)

            return {
                ...initState,
                appAddress: livepeerAppAddress
            }
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

api.store(onNewEvent,
    [
        of({event: INITIALISE_EMISSION}),
        livepeerToken$(api).pipe(mergeMap(livepeerToken => livepeerToken.events())),
        bondingManager$(api).pipe(mergeMap(bondingManager => bondingManager.events())),
        roundsManager$(api).pipe(mergeMap(roundsManager => roundsManager.events()))
    ]
)

const userLptBalance$ = () =>
    zip(api.accounts().pipe(first()),
        livepeerToken$(api)).pipe(
        mergeMap(([accounts, token]) => token.balanceOf(accounts[0])))

const appLptBalance$ = () =>
    livepeerToken$(api).pipe(
        mergeMap(token => token.balanceOf(livepeerAppAddress)))

const appApprovedTokens$ = () =>
    zip(livepeerToken$(api), bondingManagerAddress$(api)).pipe(
        mergeMap(([token, bondingManagerAddress]) => token.allowance(livepeerAppAddress, bondingManagerAddress)))


const delegatorInfo$ = () =>
    bondingManager$(api).pipe(
        mergeMap(bondingManager => bondingManager.getDelegator(livepeerAppAddress)),
        map(delegator => {return {bondedAmount: delegator.bondedAmount, delegateAddress: delegator.delegateAddress}}))

const currentRound$ = () =>
    roundsManager$(api).pipe(
        mergeMap(roundsManager => roundsManager.currentRound()))

const unbondingLockInfos$ = () =>
    bondingManager$(api).pipe(
        mergeMap(mapBondingManagerToLockInfo),
        filter(unbondingLockInfo => parseInt(unbondingLockInfo.amount) !== 0),
        toArray())

const mapBondingManagerToLockInfo = bondingManager =>
    zip(bondingManager.getDelegator(livepeerAppAddress), currentRound$()).pipe(
        mergeMap(([delegator, currentRound]) => range(0, delegator.nextUnbondingLockId).pipe(
            mergeMap(unbondingLockId => bondingManager.getDelegatorUnbondingLock(livepeerAppAddress, unbondingLockId).pipe(
                map(unbondingLockInfo => { return {...unbondingLockInfo, id: unbondingLockId }}))),
            map(unbondingLockInfo => { return {...unbondingLockInfo, disableWithdraw: parseInt(currentRound) < parseInt(unbondingLockInfo.withdrawRound)}}))))

