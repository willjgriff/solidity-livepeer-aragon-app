import BondingManagerAbi from '../abi/bondingManager-abi.json'
import {BondingManagerAddress} from "../config"

const BondingManager = (app) => app.external(BondingManagerAddress, BondingManagerAbi)

export default BondingManager