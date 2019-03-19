import React from "react"
import {Button} from "@aragon/ui"

const UnbondingLockItem = props => {
    return (
        <li>Unbonding lock ID: {props.unbondingLockInfo.id} LPT value: {props.unbondingLockInfo.amount} Withdraw
            round: {props.unbondingLockInfo.withdrawRound}&nbsp;&nbsp;&nbsp;
            <Button disabled={props.unbondingLockInfo.disableWithdraw} mode="strong">Withdraw tokens</Button>
        </li>
    )
}

export default function UnbondingLockItems({unbondingLockInfos}) {
    return (
        <ul start="0" style={{listStyleType: "none"}}>
            {unbondingLockInfos.map(unbondingLockInfo =>
                <UnbondingLockItem key={unbondingLockInfo.id} unbondingLockInfo={unbondingLockInfo}/>)}
        </ul>
    )
}

