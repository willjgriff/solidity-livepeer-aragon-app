import LivepeerTokenAbi from '../abi/livepeerToken-abi.json'
import {LivepeerTokenAddress} from "../config"

const LivepeerToken = (app) => app.external(LivepeerTokenAddress, LivepeerTokenAbi)

export default LivepeerToken