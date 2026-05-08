"use client";

import Image from "next/image";

import {
    MoreHorizontal,
    MessageCircle,
    ChevronDown,
} from "lucide-react";

import {
    TableCell,
    TableRow,
} from "@/components/ui/table";

import { TaskItem } from "./TaskTable";

interface TaskRowProps {
    task: TaskItem;
}

const statusStyles = {
    NOT_STARTED: {
        dot: "bg-gray-400",
        label: "Not Started",
    },

    IN_PROGRESS: {
        dot: "bg-amber-400",
        label: "In Progress",
    },

    BLOCKED: {
        dot: "bg-red-400",
        label: "Blocked",
    },

    DONE: {
        dot: "bg-emerald-400",
        label: "Done",
    },

    CUSTOM: {
        dot: "bg-purple-400",
        label: "Custom",
    },
};

const priorityStyles = {

    LOW:
        "bg-blue-500/10 text-blue-400 border border-blue-500/10",

    MEDIUM:
        "bg-amber-500/10 text-amber-400 border border-amber-500/10",

    HIGH:
        "bg-purple-500/10 text-purple-400 border border-purple-500/10",
};

const TaskRow = ({ task }: TaskRowProps) => {

    const currentStatus = statusStyles[task.status];

    return (

        <TableRow className="group border-b border-white/[0.04] transition-all duration-200 hover:bg-white/[0.02]">

            <TableCell className="px-6 py-5">

                <div className="flex items-start gap-4">

                    <div className="mt-1 flex flex-col gap-[3px] opacity-0 transition-opacity duration-200 group-hover:opacity-100">

                        <div className="h-[3px] w-[3px] rounded-full bg-gray-500" />

                        <div className="h-[3px] w-[3px] rounded-full bg-gray-500" />

                        <div className="h-[3px] w-[3px] rounded-full bg-gray-500" />

                    </div>

                    <div className="space-y-1">

                        <h3 className="text-[15px] font-medium tracking-[0.01em] text-white">
                            {task.title}
                        </h3>

                        <p className="line-clamp-1 max-w-[420px] text-sm leading-relaxed text-gray-400">
                            {task.description}
                        </p>

                    </div>

                </div>

            </TableCell>

            <TableCell>

                <button className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 transition-all duration-200 hover:bg-white/[0.04]">

                    <span
                        className={`h-2 w-2 rounded-full ${currentStatus.dot}`}
                    />

                    <span className="text-sm text-gray-200">
                        {currentStatus.label}
                    </span>

                    <ChevronDown
                        size={14}
                        className="text-gray-500"
                    />

                </button>

            </TableCell>

            <TableCell>

                <button className="flex items-center gap-3 rounded-xl px-2 py-1 transition-all duration-200 hover:bg-white/[0.03]">

                    <Image
                        src={task.assignee.avatar}
                        alt={task.assignee.name}
                        width={34}
                        height={34}
                        className="rounded-full border border-white/10"
                    />

                    <span className="text-sm text-gray-200">
                        {task.assignee.name}
                    </span>

                </button>

            </TableCell>

            <TableCell>

                <div
                    className={`inline-flex rounded-lg px-3 py-1 text-xs font-medium tracking-wide ${priorityStyles[task.priority]}`}
                >
                    {task.priority}
                </div>

            </TableCell>

            <TableCell>

                <span className="text-sm font-medium text-gray-300">
                    {task.estimate}
                </span>

            </TableCell>

            <TableCell>

                <button className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white">

                    <MessageCircle size={16} />

                    <span className="text-sm">
                        {task.comments}
                    </span>

                </button>

            </TableCell>

            <TableCell>

                <button className="opacity-0 transition-all duration-200 hover:text-white group-hover:opacity-100">

                    <MoreHorizontal
                        size={18}
                        className="text-gray-500"
                    />

                </button>

            </TableCell>

        </TableRow>
    );
};

export default TaskRow;