"use client";

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import TaskRow from "./TaskRow";

import {
    ChevronsLeft,
    ChevronsRight,
    ClipboardList,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { availableStatusType, TaskItem } from "@/app/types/general.types";




const TaskMainComp = () => {

    const scrollRef = useRef<HTMLDivElement>(null);
    const params = useParams();
    const [hasVerticalScroll, setHasVerticalScroll] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["board-tasks", params.boardId],

        queryFn: async () => {
            const res = await fetch(`/api/boards/${params.boardId}`);
            if (!res.ok) {
                toast.error("Something went wrong.Try refresh");
                throw new Error("Failed to fetch Tasks for the board");
            }
            return res.json();
        },
    });

    const tasks = data?.data?.tasks ?? [];
    const availableStatus: availableStatusType[] = data?.data?.board?.columns ?? [];
    console.log(data)
    console.log(tasks)

    useEffect(() => {

        const el = scrollRef.current;

        if (!el) return;

        const checkScroll = () => {

            setHasVerticalScroll(
                el.scrollHeight > el.clientHeight
            );

        };

        checkScroll();

        window.addEventListener("resize", checkScroll);

        return () => {
            window.removeEventListener("resize", checkScroll);
        };

    }, [data]);

    return (

        <div className="flex h-full min-h-0 flex-col rounded-md overflow-hidden">

            {/* Top Section */}
            <div className="flex min-h-0 flex-1 flex-col bd_blu">

                {/* Info Cards */}
                <div className="m-1 border border-white/[0.04] p-4">
                    info cards
                </div>

                {/* Toolbar */}
                <div className="mx-1 mb-1 border border-white/[0.04] p-4">
                    toolbar
                </div>

                {/* Table Wrapper */}
                <div className="mx-1 flex min-h-0 flex-1 flex-col  border border-white/[0.04] ">

                    {/* Fixed Header */}
                    <Table className="table-fixed min-w-[700px] w-full">

                        <TableHeader className="bg-lg_grey/35">

                            <TableRow className="h-[34px] border-b border-white/[0.04] text-sm tracking-wider text-gray-300 hover:bg-transparent">

                                <TableHead className="min-w-3 w-[35%] text-left ">
                                    Task
                                </TableHead>

                                <TableHead className="w-[150px] text-center ">
                                    Status
                                </TableHead>

                                <TableHead className="w-[130px] text-center ">
                                    Progress
                                </TableHead>

                                <TableHead className="w-[80px] text-center ">
                                    Assignee
                                </TableHead>

                                <TableHead className="w-[80px] text-center ">
                                    Estimate
                                </TableHead>

                                <TableHead className="w-[90px] text-center ">
                                    Comments
                                </TableHead>

                                <TableHead className="w-[90px] text-center ">
                                    Priority
                                </TableHead>

                                <TableHead className={`w-[35px]  ${hasVerticalScroll ? "pr-9" : ""}`} />


                            </TableRow>

                        </TableHeader>

                    </Table>

                    {/* Scroll Area */}
                    <div className="flex-1 overflow-auto minimal-scrollbar" ref={scrollRef}>

                        <Table className="table-fixed min-w-[1100px] w-full">

                            <TableBody>

                                {tasks.map((val: TaskItem) => {
                                    return (
                                        <TaskRow
                                            key={val.id}
                                            task={val}
                                            availableStatus={availableStatus}
                                        />
                                    );
                                })}

                            </TableBody>

                        </Table>

                        {tasks.length === 0 && (

                            <div className="flex h-full items-center justify-center gap-1 text-gray-500">

                                <ClipboardList size={22} />

                                <p className="mt-1 text-sm tracking-wider">
                                    No tasks yet
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </div>

            {/* Footer */}
            <div className="mx-1 grid grid-cols-3 rounded-b-xl border border-white/[0.04] p-1 bd_blu">

                <p className="flex items-center pl-2 text-xs text-gray-500">
                    Showing 1 to 5 of 5 tasks
                </p>

                <div className="flex items-center justify-center">

                    <div className="flex items-center">

                        <ChevronsLeft
                            size={20}
                            className="cursor-pointer text-gray-500 hover:text-gray-400"
                        />

                        <button className="flex h-4 min-w-[20px] items-center justify-center rounded-md p-[8px] text-xs font-medium text-gray-400">
                            1
                        </button>

                        <button className="flex h-4 min-w-[20px] items-center justify-center rounded-md border border-lg_grey p-[8px] text-xs font-medium text-gray-400">
                            2
                        </button>

                        <button className="flex h-4 min-w-[20px] items-center justify-center rounded-md p-[8px] text-xs font-medium text-gray-400">
                            3
                        </button>

                        <ChevronsRight
                            size={20}
                            className="cursor-pointer text-gray-500 hover:text-gray-400"
                        />

                    </div>

                </div>

            </div>

        </div>
    );
};

export default TaskMainComp;