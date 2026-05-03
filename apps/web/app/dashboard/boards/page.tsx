"use client"
import BoardCard from '@/app/components/utility/board-utils/BoardCard'
import { BoardCardProps } from '@/app/types/general.types';
import React, { useState, useEffect } from 'react'

const page = () => {


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-3 ">
            {/* <BoardCard
                title="Product Roadmap"
                boardId="c58596f3-5c39-49e1-bdb6-fe4cc05470b8"
                role="MANAGER"
                description="Planning and tracking "
                totalTasks={12}
                blockedTasks={5}
                inProgress={3}
                updatedAt="2h ago"
                members={mem}
            /> */}

        </div>
    )
}

export default page