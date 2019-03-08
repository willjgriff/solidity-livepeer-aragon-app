import LivepeerTokenAbi from '../abi/LivepeerTokenAbi.json'
import {LivepeerTokenAddress} from "../config";

const LivepeerToken = (app) => app.external(LivepeerTokenAddress, LivepeerTokenAbi)

export default LivepeerToken