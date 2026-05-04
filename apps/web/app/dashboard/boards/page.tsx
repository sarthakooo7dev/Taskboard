"use client"
import BoardCard from '@/app/components/utility/board-utils/BoardCard'
import BoardCardSkeleton from '@/app/components/utility/loader-components/BoardCardSkeleton';
import { BoardCardProps } from '@/app/types/general.types';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react'

const page = () => {

    const { data, isLoading } = useQuery({
        queryKey: ["boards", "summary"],
        queryFn: fetchBoardsSummary,
        staleTime: 20 * 1000, // 20 seconds
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-3">
                {[...Array(3)].map((_, i) => (
                    <BoardCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-3 ">

            {data.map((val: BoardCardProps) => {
                return <div key={val.boardId}>
                    <BoardCard
                        title={val.title}
                        boardId={val.boardId}
                        role={val.role}
                        description={val.description}
                        totalTasks={val.totalTasks}
                        blockedTasks={val.blockedTasks}
                        inProgressTasks={val.inProgressTasks}
                        totalMembers={val.totalMembers}
                        updatedAt={val.updatedAt}
                        members={val.members}
                    />
                </div>
            })}
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


const fetchBoardsSummary = async () => {
    const res = await fetch("/api/boards/summary");

    if (!res.ok) {
        throw new Error("Failed to fetch boards");
    }

    const json = await res.json();
    return json.data;
};

export default page