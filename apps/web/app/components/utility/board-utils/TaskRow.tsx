"use client";

import Image from "next/image";
import { Loader, MessageCircleMore, MoreHorizontal, Pencil, Trash2, } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";

import { TaskRowProps } from "@/app/types/general.types";
import { formatEstimate, priorityStyles, statusStyles, } from "@/app/lib/utils/ui/boardHelpers";
import { TaskStatus } from "@/app/types/general.types";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useUpdateTask } from "@/app/hooks/useUpdateTask";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

const TaskRow = ({ task, availableStatus, boardId, handleSelectedTask }: TaskRowProps) => {

    const updateTaskMutation = useUpdateTask({ boardId });


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

    const handleStatusUpdate = (selectedStatusId: string) => {


        const selectedColumn = availableStatus.find((status) => status.id === selectedStatusId);

        console.log(selectedColumn?.id)
        console.log(task.id)
        console.log(task.column.type)

        if (!selectedColumn) return;

        // By default preserve current progress
        let updatedProgress = task.progress;

        // CASE 1: User is moving task TO Done
        if (selectedColumn.type === "DONE") {
            updatedProgress = 100;
        }

        // CASE 2: User is moving task TO NOT_STARTED
        else if (selectedColumn.type === "NOT_STARTED") {
            updatedProgress = 0;
        }

        // CASE 3: // Moving FROM Not Started to active status
        else if (task.progress === 0) {
            updatedProgress = 10;
        }

        // CASE 4: // Any NON-DONE status
        else if (task.progress === 100) {
            updatedProgress = 90;
        }

        updateTaskMutation.mutate({
            taskId: task.id,
            columnId: selectedColumn.id,
            progress: updatedProgress,
        });
    }

    const handleTask = (editMode?: boolean) => {
        handleSelectedTask(task, editMode)
    }

    return (

        <div
            className="grid min-h-[64px] border-b border-white/[0.04] transition-colors duration-200 hover:bg-lg_grey/15"
            style={{ gridTemplateColumns: columns }} >

            {/* TASK */}
            <div className="group flex min-w-0 cursor-pointer flex-col justify-center px-4 py-2 " onClick={() => handleTask(false)}>
                <h3 className="truncate text-sm font-medium tracking-wider text-gray-300 group-hover:text-gray-100">
                    {task.title}
                </h3>
                <p className="truncate text-xs leading-5 tracking-wide text-gray-400 ">
                    {truncateDescription(task.description)}
                </p>
            </div>

            {/* STATUS */}
            <div className=" flex items-center justify-center px-2">
                <Select
                    value={task.column.id}
                    onValueChange={handleStatusUpdate} >
                    <SelectTrigger className="relative h-8 w-full max-w-[130px] border border-white/[0.06] bg-white/[0.02] text-xs text-gray-200 shadow-none transition-colors duration-200 focus:ring-0">
                        <SelectValue />
                        {
                            updateTaskMutation.isPending && (
                                <Loader
                                    size={14}
                                    className="z-10 bg-dk_grey absolute right-2 animate-[spin_2s_linear_infinite] text-gray-300"
                                />
                            )
                        }
                    </SelectTrigger>

                    <SelectContent className="cursor-pointer bg-dk_grey p-2 text-gray-300">
                        {availableStatus.map((val) => {
                            return (
                                <SelectItem
                                    key={val.id}
                                    value={val.id}
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
            <div className=" flex items-center px-2 ">
                <div className="flex w-full items-center gap-2">
                    <div className="h-[6px] min-w-0 flex-1 overflow-hidden rounded-full border border-lg_grey">
                        <div className="h-full rounded-full bg-green-400/70 transition-all duration-300"
                            style={{ width: `${task.progress}%` }} />
                    </div>
                    <p className="whitespace-nowrap text-[10px]  w-8 tracking-wider text-gray-300">
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
            <div className="flex items-center justify-center">
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="rounded-md p-1.5 text-gray-400 disabled:text-gray-700" disabled={updateTaskMutation.isPending} >
                            <MoreHorizontal size={18} className=" transition-colors duration-200  " />
                        </button>
                    </PopoverTrigger>


                    {/* POPOVER CONTENT */}
                    <PopoverContent side="bottom" align="end" className="z-50 w-[120px] rounded-md border border-white/[0.06] bg-dk_grey p-1 shadow-2xl shadow-black/30" >

                        <div className="flex flex-col">
                            {/* EDIT */}
                            <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs tracking-wider text-gray-300 transition-colors duration-200 hover:bg-lg_grey/30" onClick={() => handleTask(true)} >
                                <Pencil size={12} />
                                <span>
                                    Edit
                                </span>
                            </button>

                            {/* DELETE */}
                            <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs tracking-wider text-red-500 transition-colors duration-200 hover:bg-lg_grey/30" >

                                <Trash2 size={15} />

                                <span>
                                    Delete
                                </span>

                            </button>

                        </div>

                    </PopoverContent>

                </Popover>

            </div>
        </div>

    );
};

export default TaskRow;