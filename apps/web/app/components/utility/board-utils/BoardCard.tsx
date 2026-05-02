"use client";

import { CalendarCheck2, Sprout, Aperture } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RoleTag from "./RoleTag";
import { getBoardState, getBoardVisual } from "@/app/lib/utils/ui/boardHelpers";
import { BoardCardProps } from "@/app/types/general.types";

const BoardCard = ({
    title,
    boardId,
    role,
    description,
    totalTasks,
    inProgress,
    updatedAt,
    blockedTasks,
    members = [],
}: BoardCardProps) => {

    const visible = members.slice(0, 3);
    const remaining = members.length - visible.length;
    const state = getBoardState(blockedTasks);
    const { Icon, bg } = getBoardVisual(boardId);

    return (
        <div
            className=" group relative p-3 rounded-xl  bg-lg_grey/30 border border-dk_border transition-all duration-200  cursor-pointer " >
            {/* Top Row */}
            <div className="flex items-center justify-center gap-2  p-1">
                <div className={`w-12 h-8 rounded-lg flex items-center justify-center ${bg}`}>
                    <Icon size={18} />
                </div>

                {/* Title */}
                <h3 className=" w-full truncate text-[15px] font-semibold opacity-90">
                    {title}
                </h3>

            </div>


            {/* State + roleTag*/}
            <div className="mt-1 flex items-center justify-between gap-2 text-xs text-gray-400">
                <p className={`text-[11px] tracking-[1px]  ${state.color}`}>
                    {state.label}
                </p>
                <RoleTag role={role} />

            </div>

            {/* Description */}
            {description && (
                <p className="mt-2 text-xs text-gray-400 leading-relaxed line-clamp-2 min-h-[2rem]">
                    {description}
                </p>
            )}

            {/* Divider */}
            <div className="mt-3 border-t border-dk_border" />

            {/* Stats */}
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                    <CalendarCheck2 size={13} /> {totalTasks} Tasks
                </span>
                <span className="flex items-center gap-1">
                    <Sprout size={13} /> {inProgress} In Progress
                </span>
            </div>

            {/* Bottom */}
            <div className="mt-4 flex items-center justify-between">
                {/* Avatars */}
                <div className="flex -space-x-2.5">
                    {visible.map((m) => (
                        <Avatar
                            key={m.id}
                            className="w-7 h-7 border border-lg_grey/30 relative z-[1]"
                        >
                            <AvatarImage src={m.image} />
                            <AvatarFallback className="text-[10px]">
                                {m.name[0]}
                            </AvatarFallback>
                        </Avatar>
                    ))}

                    {remaining > 0 && (
                        <div className="w-7 h-7 rounded-full bg-gray-700 text-[11px] flex items-center justify-center border border-lg_grey relative z-10">
                            +5
                        </div>
                    )}
                </div>

                {/* Updated */}
                <div className="flex items-center gap-1 text-[11px] text-gray-500 ">
                    <span>Updated recently</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                </div>
            </div>





        </div>
    );
};



export default BoardCard;