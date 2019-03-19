import BondingManagerAbi from '../abi/bondingManager-abi'
import LivepeerTokenAbi from '../abi/livepeerToken-abi'
import ControllerAbi from '../abi/controller-abi'
import RoundsManagerAbi from '../abi/roundsManager-abi'
import {CONTROLLER_ADDRESS} from "../config"
import {contractId} from './utils/livepeerHelpers'

//TODO: Convert to an object and return const observables with shareReplay(1) or use memoirzation, could reduce load time.
// Perhaps put this off until we get errors in app.store(). Had problems experimenting with accessing 2 observables from this object at the same time.
const controller = (app) => app.external(CONTROLLER_ADDRESS, ControllerAbi)

const livepeerAddressOf$ = (app, livepeerContractName) => controller(app).getContract(contractId(livepeerContractName))

const livepeerTokenAddress$ = (app) => livepeerAddressOf$(app, "LivepeerToken")

const bondingManagerAddress$ = (app) => livepeerAddressOf$(app, "BondingManager")

const roundsManagerAddress$ = (app) => livepeerAddressOf$(app, "RoundsManager")

const livepeerToken$ = (app) =>
    livepeerTokenAddress$(app)
        // .do(address => console.log("LivepeerToken address: " + address))
        .map(address => app.external(address, LivepeerTokenAbi))

const bondingManager$ = (app) =>
    bondingManagerAddress$(app)
        // .do(address => console.log("BondingManager address: " + address))
        .map(address => app.external(address, BondingManagerAbi))

const roundsManager$ = (app) =>
    roundsManagerAddress$(app)
        // .do(address => console.log("RoundsManager address: " + address))
        .map(address => app.external(address, RoundsManagerAbi))

export {
    livepeerTokenAddress$,
    bondingManagerAddress$,
    roundsManagerAddress$,
    livepeerToken$,
    bondingManager$,
    roundsManager$
}