import BN from "bn.js";

const expandTokenCount = (tokenCount) => new BN(tokenCount).mul(new BN(10).pow(new BN(18))).toString()

const reduceTokenCount = (tokenCount) => (new BN(tokenCount).div(new BN(10).pow(new BN(18)))).toString()

export {expandTokenCount, reduceTokenCount}