"use client";

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell
} from "@/components/ui/table";

import TaskRow from "./TaskRow";
import { ChevronsLeft, ChevronsRight, ClipboardList, StickyNote } from "lucide-react";

export type TaskStatus =
    | "NOT_STARTED"
    | "IN_PROGRESS"
    | "BLOCKED"
    | "DONE"
    | "CUSTOM";

export interface TaskItem {
    id: string;

    title: string;

    description: string;

    status: TaskStatus;

    priority: "LOW" | "MEDIUM" | "HIGH";

    estimate: string;

    comments: number;

    selected?: boolean;

    assignee: {
        id: string;
        name: string;
        avatar: string;
    };
}

interface TaskTableProps {
    tasks: TaskItem[];
}

const TaskTable = ({ tasks }: TaskTableProps) => {
    return (

        <div className="overflow-hidden flex flex-col  h-full justify-between rounded-md ">

            <div className="flex flex-col  flex-1">
                <div className="border border-white/[0.04] p-4 m-1">
                    info cards
                </div>

                <div className="border border-white/[0.04] p-4 mx-1 mb-1">
                    toolbar
                </div>

                <div className=" border border-white/[0.04] mx-1  ">
                    <Table className=" ">

                        <TableHeader>

                            <TableRow className="h-[34px] text-gray-300 tracking-wider text-md border-b border-white/[0.04] hover:bg-transparent">
                                <TableHead className=" ">
                                    Task
                                </TableHead>

                                <TableHead className=" ">
                                    Status
                                </TableHead>

                                <TableHead className=" ">
                                    Assignee
                                </TableHead>

                                <TableHead className=" ">
                                    Priority
                                </TableHead>

                                <TableHead className=" ">
                                    Estimate
                                </TableHead>

                                <TableHead className=" ">
                                    Comments
                                </TableHead>

                                <TableHead className="w-[60px]" />

                            </TableRow>

                        </TableHeader>

                        <TableBody className="">

                            {/* {children} */}
                        </TableBody>

                    </Table>
                </div>
                {true && (

                    <div className="flex-1 flex items-center justify-center mx-1 border-l border-r border-white/[0.04] text-gray-500 gap-1">
                        <ClipboardList size={22} />
                        <p className="mt-1 text-sm tracking-wider"> No tasks yet </p>
                    </div>

                )}
            </div>


            <div className=" p-1 mx-1 grid grid-cols-3  rounded-b-xl  border border-white/[0.04]">

                <p className="pl-2 flex items-center text-xs text-gray-500">
                    Showing 1 to 5 of 5 tasks
                </p>

                <div className="flex items-center justify-center  ">
                    <div className="flex items-center  ">
                        <ChevronsLeft size={20} className="text-gray-500 hover:text-gray-400 cursor-pointer" />


                        <button className="flex h-4 min-w-[20px] items-center justify-center rounded-md  p-[8px] text-xs font-medium text-gray-400">
                            1
                        </button>
                        <button className="flex h-4 min-w-[20px] items-center justify-center rounded-md border border-lg_grey p-[8px] text-xs font-medium text-gray-400">
                            2
                        </button>
                        <button className="flex h-4 min-w-[20px] items-center justify-center rounded-md  p-[8px] text-xs font-medium text-gray-400">
                            3
                        </button>

                        <ChevronsRight size={20} className="text-gray-500 hover:text-gray-400 cursor-pointer" />
                    </div>

                </div>

            </div>

        </div>
    );
};

export default TaskTable;