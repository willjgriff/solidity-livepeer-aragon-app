import '@babel/polyfill'
import AragonApi from '@aragon/api'
import {
    controllerAddress$,
    livepeerTokenAddress$,
    livepeerToken$,
    bondingManagerAddress$,
    bondingManager$,
    roundsManager$
} from '../web3/ExternalContracts'
import {of, range} from "rxjs";
import {first, mergeMap, map, filter, toArray, zip, tap} from "rxjs/operators"

const INITIALISE_EVENT = Symbol("INITIALISE_APP")
const ACCOUNT_CHANGED_EVENT = Symbol("ACCOUNT_CHANGED")

const api = new AragonApi()
let livepeerAppAddress = "0x0000000000000000000000000000000000000000"

//TODO: Add rebond functions.
//TODO: Replace external contract events with app events to minimise processing.
//TODO: Rearrange UI, make actions appear in slide in menu.
//TODO: More disabling of buttons/error handling when functions can't be called.
//TODO: Bond Tokens should display claimable tokens plus bonded tokens, as that's the amount that is earned on.

const initialState = async (state) => {
    return {
        ...state,
        livepeerTokenAddress: await livepeerTokenAddress$(api).toPromise(),
        livepeerControllerAddress: await controllerAddress$(api).toPromise(),
        userLptBalance: await userLptBalance$().toPromise(),
        appsLptBalance: await appLptBalance$().toPromise(),
        appApprovedTokens: await appApprovedTokens$().toPromise(),
        delegatorInfo: await delegatorInfo$().toPromise(),
        currentRound: await currentRound$().toPromise(),
        disableUnbondTokens: await disableUnbondTokens$().toPromise(),
        unbondingLockInfos: await unbondingLockInfos$().toPromise()
    }
}

const onNewEvent = async (state, event) => {

    switch (event.event) {
        // TODO: Work out when the store emits, and why it emits lots of events on init (it isn't due to cache/cookies)
        //  then sort out storing of the app address for the script. Is currently confusing and potentially unreliable.
        case INITIALISE_EVENT:
            console.log("INITIALISE")
            return await initialState(state)
        case ACCOUNT_CHANGED_EVENT:
            console.log("ACCOUNT CHANGED")
            return {
                ...state,
                userLptBalance: await userLptBalance$().toPromise()
            }
        case 'Execute':
        case 'AppInitialized':
            console.log("APP INITIALIZED OR EXECUTE")
            livepeerAppAddress = event.address

            const initState = await initialState(state)

            return {
                ...initState,
                appAddress: livepeerAppAddress
            }
        case 'NewControllerSet':
            console.log("NEW CONTROLLER SET")
            return {
                ...state,
                livepeerControllerAddress: event.returnValues.livepeerController
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
                appsLptBalance: await appLptBalance$().toPromise(),
                disableUnbondTokens: await disableUnbondTokens$().toPromise()
            }
        case 'ClaimEarnings':
            console.log("CLAIM EARNINGS")
            return {
                ...state,
                delegatorInfo: await delegatorInfo$().toPromise()
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
                unbondingLockInfos: await unbondingLockInfos$().toPromise(),
                disableUnbondTokens: await disableUnbondTokens$().toPromise()
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

const accountChangedEvent$ = () =>
    api.accounts().pipe(
        map(account => {
            return {event: ACCOUNT_CHANGED_EVENT, account: account}
        }))

api.store(onNewEvent,
    [
        of({event: INITIALISE_EVENT}),
        accountChangedEvent$(),
        livepeerToken$(api).pipe(mergeMap(livepeerToken => livepeerToken.events())),
        bondingManager$(api).pipe(mergeMap(bondingManager => bondingManager.events())),
        roundsManager$(api).pipe(mergeMap(roundsManager => roundsManager.events()))
    ]
)

const userLptBalance$ = () =>
    api.accounts().pipe(
        first(),
        zip(livepeerToken$(api)),
        mergeMap(([accounts, token]) => token.balanceOf(accounts[0])))

const appLptBalance$ = () =>
    livepeerToken$(api).pipe(
        mergeMap(token => token.balanceOf(livepeerAppAddress)))

const appApprovedTokens$ = () =>
    livepeerToken$(api).pipe(
        zip(bondingManagerAddress$(api)),
        mergeMap(([token, bondingManagerAddress]) => token.allowance(livepeerAppAddress, bondingManagerAddress)))

const delegatorInfo$ = () =>
    bondingManager$(api).pipe(
        mergeMap(bondingManager => bondingManager.getDelegator(livepeerAppAddress)),
        map(delegator => {
            return {
                bondedAmount: delegator.bondedAmount,
                delegateAddress: delegator.delegateAddress,
                lastClaimRound: delegator.lastClaimRound
            }
        }))

const currentRound$ = () =>
    roundsManager$(api).pipe(
        mergeMap(roundsManager => roundsManager.currentRound()))

const mapBondingManagerToLockInfo = bondingManager =>
    bondingManager.getDelegator(livepeerAppAddress).pipe(
        zip(currentRound$()), // Zip here so we only get the current round once, if we did it after the range observable we would do it more times than necessary.
        mergeMap(([delegator, currentRound]) => range(0, delegator.nextUnbondingLockId).pipe(
            mergeMap(unbondingLockId => bondingManager.getDelegatorUnbondingLock(livepeerAppAddress, unbondingLockId).pipe(
                map(unbondingLockInfo => {
                    return {...unbondingLockInfo, id: unbondingLockId}
                }))),
            map(unbondingLockInfo => {
                return {
                    ...unbondingLockInfo,
                    disableWithdraw: parseInt(currentRound) < parseInt(unbondingLockInfo.withdrawRound)
                }
            }))))

const sortByLockId = (first, second) => first.id > second.id ? 1 : -1

const unbondingLockInfos$ = () =>
    bondingManager$(api).pipe(
        mergeMap(mapBondingManagerToLockInfo),
        filter(unbondingLockInfo => parseInt(unbondingLockInfo.amount) !== 0),
        toArray(),
        map(unbondingLockInfos => unbondingLockInfos.sort(sortByLockId)))

const disableUnbondTokens$ = () =>
    bondingManager$(api).pipe(
        mergeMap(bondingManager => bondingManager.maxEarningsClaimsRounds()),
        zip(currentRound$(), delegatorInfo$()),
        map(([maxRounds, currentRound, delegatorInfo]) => delegatorInfo.lastClaimRound <= currentRound - maxRounds))
