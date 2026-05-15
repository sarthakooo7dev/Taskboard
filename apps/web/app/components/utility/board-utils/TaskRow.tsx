"use client";

import Image from "next/image";

import {
    MessageCircleMore,
    MoreHorizontal,
} from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { TaskRowProps } from "@/app/types/general.types";

import {
    formatEstimate,
    priorityStyles,
    statusStyles,
} from "@/app/lib/utils/ui/boardHelpers";

const columns = `
    minmax(320px, 2.4fr)
    minmax(140px, 1.2fr)
    minmax(120px, 1fr)
    minmax(90px, 0.8fr)
    minmax(90px, 0.8fr)
    minmax(100px, 0.9fr)
    minmax(100px, 0.9fr)
    minmax(40px, 0.4fr)
`;

const TaskRow = ({ task, availableStatus }: TaskRowProps) => {
    const truncateDescription = (desc: string,) => {

        if (!desc) return "";
        if (desc.length <= 60) {
            return desc;
        }
        const sliced = desc.slice(0, 60);
        const lastSpaceIndex = sliced.lastIndexOf(" ");
        return (
            sliced.slice(0, lastSpaceIndex) + "..."
        );
    };

    return (

        <div
            className="grid min-h-[64px] border-b border-white/[0.04] transition-colors duration-200 hover:bg-lg_grey/15"
            style={{
                gridTemplateColumns: columns,
            }}
        >

            {/* TASK */}
            <div className="flex min-w-0 cursor-pointer flex-col justify-center px-4 py-2 ">

                <h3 className="truncate text-sm font-medium tracking-wider text-gray-300">
                    {task.title}
                </h3>

                <p className="truncate text-xs leading-5 tracking-wide text-gray-400">
                    {truncateDescription(task.description,)}
                </p>
            </div>

            {/* STATUS */}
            <div className=" flex items-center justify-center px-2">
                <Select
                    defaultValue={task.column.name}
                    onValueChange={(value) => {
                        console.log(value);
                    }}              >

                    <SelectTrigger className="h-8 w-full max-w-[130px] border border-white/[0.06] bg-white/[0.02] text-xs text-gray-200 shadow-none transition-colors duration-200 focus:ring-0">
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent className="cursor-pointer bg-dk_grey p-2 text-gray-300">
                        {availableStatus.map((val) => {
                            return (
                                <SelectItem
                                    key={val.id}
                                    value={val.name}
                                    className="cursor-pointer border-none focus:bg-lg_grey/50 focus:text-white focus:outline-none focus:ring-0 data-[highlighted]:bg-lg_grey/50 data-[highlighted]:text-gray-200"  >

                                    <div className="flex items-center gap-2 tracking-wider">
                                        <span
                                            className={`h-2 w-2 rounded-full ${statusStyles[val.type].dot}`} />
                                        <span>
                                            {val.name}
                                        </span>
                                    </div>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>

            </div>

            {/* PROGRESS */}
            <div className=" flex items-center px-3">
                <div className="flex w-full items-center gap-2">
                    <div className="h-[6px] min-w-0 flex-1 overflow-hidden rounded-full border border-lg_grey">
                        <div className="h-full rounded-full bg-green-400/70 transition-all duration-300"
                            style={{ width: `${task.progress}%` }} />
                    </div>
                    <p className="whitespace-nowrap text-[10px] tracking-wider text-gray-300">
                        {task.progress}%
                    </p>
                </div>
            </div>

            {/* ASSIGNEE */}
            <div className=" flex items-center justify-center">
                <Image
                    src={task.assignedTo.avatar}
                    alt={task.assignedTo.name}
                    width={25}
                    height={25}
                    title={task.assignedTo.name}
                    className="cursor-pointer rounded-full border border-dk_grey"
                />

            </div>

            {/* ESTIMATE */}
            <div className=" flex items-center justify-center">
                <span className="text-sm font-medium text-gray-400">
                    {formatEstimate(task.estimate)}
                </span>
            </div>

            {/* COMMENTS */}
            <div className=" flex items-center justify-center">
                <div className="flex items-center text-gray-400">
                    <MessageCircleMore size={16} />
                    <p className="mt-[-1px] pl-1 text-sm">
                        {task?._count?.comments ?? 0}
                    </p>
                </div>
            </div>

            {/* PRIORITY */}
            <div className=" flex items-center justify-end ">
                <div
                    className={`inline-flex  rounded-md px-2 py-[2px] text-[10px] mr-2 tracking-widest ${priorityStyles[task.Priority]}`} >
                    {task.Priority}
                </div>
            </div>

            {/* MENU */}
            <div className=" flex items-center justify-center ">
                <button className="transition-colors duration-200 hover:text-white">
                    <MoreHorizontal size={18} className="text-gray-500" />
                </button>
            </div>
        </div>

    );
};

export default TaskRow;