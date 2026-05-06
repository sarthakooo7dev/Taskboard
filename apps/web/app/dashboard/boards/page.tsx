"use client"
import BoardCard from '@/app/components/utility/board-utils/BoardCard'
import CreateBoardCard from '@/app/components/utility/board-utils/CreateBoardCard';
import CreateBoardModal from '@/app/components/utility/board-utils/CreateBoardModal';
import BoardCardSkeleton from '@/app/components/utility/loader-components/BoardCardSkeleton';
import { useBoardModalStatus } from '@/app/store/board-store';
import { BoardCardProps } from '@/app/types/general.types';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from "@tanstack/react-query";
import React, { useState, useEffect } from 'react'

const page = () => {

    const { openModal, closeModal } = useBoardModalStatus();

    const { data, isLoading } = useQuery({
        queryKey: ["boards", "summary"],
        queryFn: fetchBoardsSummary,
        staleTime: 10 * 1000, // 10 seconds
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
            <CreateBoardCard openModal={openModal} closeModal={closeModal} />

            <CreateBoardModal />
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