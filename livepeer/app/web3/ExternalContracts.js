import BondingManagerAbi from '../abi/bondingManager-abi'
import LivepeerTokenAbi from '../abi/livepeerToken-abi'
import ControllerAbi from '../abi/controller-abi'
import RoundsManagerAbi from '../abi/roundsManager-abi'
import {CONTROLLER_ADDRESS} from "../config"
import {contractId} from './utils/livepeerHelpers'

const controller = (app) => app.external(CONTROLLER_ADDRESS, ControllerAbi)

const livepeerAddressOf$ = (app, livepeerContractName) => controller(app).getContract(contractId(livepeerContractName))

const livepeerTokenAddress$ = (app) => livepeerAddressOf$(app, "LivepeerToken")

const bondingManagerAddress$ = (app) => livepeerAddressOf$(app, "BondingManager")

const roundsManagerAddress$ = (app) => livepeerAddressOf$(app, "RoundsManager")

const livepeerToken$ = (app) =>
    livepeerTokenAddress$(app)
        .do(address => console.log("LivepeerToken address: " + address))
        .map(address => app.external(address, LivepeerTokenAbi))

const bondingManager$ = (app) =>
    bondingManagerAddress$(app)
        .map(address => app.external(address, BondingManagerAbi))

const roundsManager$ = (app) =>
    roundsManagerAddress$(app)
        .map(address => app.external(address, RoundsManagerAbi))

export {
    livepeerTokenAddress$,
    bondingManagerAddress$,
    roundsManagerAddress$,
    livepeerToken$,
    bondingManager$,
    roundsManager$
}