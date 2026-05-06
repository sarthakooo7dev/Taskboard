"use client";

import { useBoardModalStatus } from "@/app/store/board-store";
import React from 'react'
import { Plus } from "lucide-react";

const CreateBoardBtn = () => {

    const { openModal } = useBoardModalStatus();

    return (
        <div
            onClick={openModal}
            className="flex justify-between pr-[5px] h-8 rounded-md bg-dk_grey border border-[rgb(50,49,54)] cursor-pointer
             hover:bg-lg_grey/30 transition-all duration-200 tracking-widest text-gray-300 gap-2 text-sm"
            aria-label="create board"
        >
            <div className="p-1 bg-lg_grey rounded-sm text-purple-500 "> <Plus size={20} /> </div>
            <div className="flex items-center"> Create</div>
        </div>
    );
}

export default CreateBoardBtn

