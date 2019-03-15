import BondingManagerAbi from '../abi/bondingManager-abi'
import LivepeerTokenAbi from '../abi/livepeerToken-abi'
import ControllerAbi from '../abi/controller-abi'
import {BONDING_MANAGER_ADDRESS, LIVEPEER_TOKEN_ADDRESS, CONTROLLER_ADDRESS} from "../config"
import {contractId} from './utils/livepeerHelpers'

const Controller = (app) => app.external(CONTROLLER_ADDRESS, ControllerAbi)

const livepeerAddressOf = (app, livepeerContractName) => Controller(app).getContract(contractId(livepeerContractName))

const LivepeerToken = (app) => app.external(LIVEPEER_TOKEN_ADDRESS, LivepeerTokenAbi)

const BondingManager = (app) => app.external(BONDING_MANAGER_ADDRESS, BondingManagerAbi)

const LivepeerToken$ = (app) =>
    livepeerAddressOf(app, "LivepeerToken")
        .map(address => app.external(address, LivepeerTokenAbi))

const BondingManager$ = (app) =>
    livepeerAddressOf(app, "BondingManager")
        .map(address => app.external(address, BondingManagerAbi))


export {BondingManager, LivepeerToken, Controller, livepeerAddressOf, LivepeerToken$, BondingManager$}