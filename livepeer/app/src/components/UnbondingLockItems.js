import React from "react"
import {Button} from "@aragon/ui"

const UnbondingLockItem = props => {
    return (
        <li>Unbonding lock ID: {props.unbondingLockInfo.id} LPT value: {props.unbondingLockInfo.amount} Withdraw
            round: {props.unbondingLockInfo.withdrawRound}&nbsp;&nbsp;&nbsp;
            <Button onClick={() => props.handleWithdrawTokens(props.unbondingLockInfo.id)}
                    disabled={props.unbondingLockInfo.disableWithdraw} mode="strong">Withdraw tokens</Button>
        </li>
    )
}

export default function UnbondingLockItems({unbondingLockInfos, handleWithdrawTokens}) {
    return (
        <ul start="0" style={{listStyleType: "none"}}>
            {unbondingLockInfos.map(unbondingLockInfo =>
                <UnbondingLockItem key={unbondingLockInfo.id} handleWithdrawTokens={handleWithdrawTokens}
                                   unbondingLockInfo={unbondingLockInfo}/>)}
        </ul>
    )
}

