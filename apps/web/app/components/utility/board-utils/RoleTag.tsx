import { userBoardRole } from '@/app/types/general.types'
import React from 'react'

const RoleTag = ({ role }: { role: userBoardRole }) => {

    const styles = {
        MANAGER: "bg-purple-400/20 text-purple-300",
        LEAD: "bg-blue-400/20 text-blue-300",
        MEMBER: "bg-orange-500/15 text-orange-300",
        VIEWER: "bg-gray-500/20 text-gray-300",
    };


    return (
        <div className={`
        text-[10px] px-[5px] py-[2px] rounded-md tracking-[1px]
        ${styles[role]}
      `}>{role}</div>
    )
}

export default RoleTag