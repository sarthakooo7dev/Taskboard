"use client";

import { BoardModalState } from "@/app/types/general.types";
import { Plus } from "lucide-react";

const CreateBoardCard = ({ openModal }: BoardModalState) => {
    return (
        <div
            className=" group relative p-3 rounded-xl border border-dashed border-white/20
                        bg-white/[0.02] hover:border-white/30 transition-all duration-200
                        cursor-pointer flex flex-col justify-center items-center min-h-[11.4rem] "
            onClick={openModal}  >
            {/* Icon container */}
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5
                              transition "  >
                <Plus
                    size={25}
                    className="text-purple-400  transition"
                />
            </div>

            {/* Title */}
            <p className="mt-3 text-sm text-gray-300 tracking-wider  transition">
                Create Board
            </p>

            {/* Subtext (important for UX clarity) */}
            <p className="text-[14px] text-gray-500 mt-1 opacity-80">
                Start a new board
            </p>
        </div>
    );
};

export default CreateBoardCard;