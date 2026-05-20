"use client";

import { formatEstimate, formatTaskDate, priorityStyles, statusStyles } from "@/app/lib/utils/ui/boardHelpers";
import { TaskDetailsSheetProps } from "@/app/types/general.types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, } from "@/components/ui/sheet";
import { ArrowRightFromLine, CalendarClock, CalendarPlus, Check, Clock, Dot, FoldHorizontal, Maximize2, Pencil, X, Zap } from "lucide-react";
import Image from "next/image";
import { title } from "process";
import { useEffect, useState } from "react";
import TaskTabs from "../Task-utils/TaskTabs";

const TaskDetailsSheet = ({ openTask, onOpenChange, task, isEditMode, setIsEditMode }: TaskDetailsSheetProps) => {

    const [isExpanded, setIsExPanded] = useState<boolean>(false)

    console.log(task)

    return (
        <Sheet open={openTask} onOpenChange={onOpenChange} >
            <SheetContent side="right" className={`w-full border-l border-white/[0.06] bg-dk_grey p-0
                     text-gray-400 transition-all duration-300 ease-in-out ${isExpanded ? "sm:!max-w-[60%]" : "sm:!max-w-[30%]"}`}>

                <div className="flex h-full flex-col">
                    {/* HEADER */}
                    <SheetHeader className="border-b border-white/[0.06] px-3 py-4 bd_grn">
                        <SheetTitle className="text-left  w-[94%] tracking-wider flex justify-between items-center">

                            {
                                isExpanded ? <div className="text-[12px] flex items-center  gap-2 w-[5rem] text-gray-300 hover:text-gray-200
                                             cursor-pointer " onClick={() => setIsExPanded(false)}>
                                    <ArrowRightFromLine size={12} /> Restore
                                </div> :
                                    <div className="text-[12px] flex items-center  gap-2 w-[5rem] text-gray-300 hover:text-gray-200
                                             cursor-pointer " onClick={() => setIsExPanded(true)}>
                                        <Maximize2 size={12} /> Expand
                                    </div>
                            }

                            {isEditMode &&
                                <div className="text-xs tracking-widest pr-2 flex items-center text-purple-500">
                                    <span className=" h-2 w-2 bg-purple-700 rounded-xl mr-2"></span> Editing
                                </div>
                            }


                        </SheetTitle>
                    </SheetHeader>

                    {/* BODY */}
                    <div className="flex-1 overflow-y-auto p-2 bd_grn">
                        <div className=" h-full  flex flex-col  ">

                            {/* # title container */}
                            <div className="  flex flex-col items-start">
                                <div className="w-full tracking-wider text-sm  flex items-center justify-between  text-gray-500 gap-1 ">
                                    <div className="flex items-center gap-1  ">
                                        <Zap size={13} className="text-purple-400" />
                                        <p>Task</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-400 tracking-widest text-[0.8rem] cursor-pointer hover:text-gray-300" onClick={() => setIsEditMode(true)}>
                                        {!isEditMode &&
                                            <>
                                                <Pencil size={12} />
                                                <p>Edit</p>
                                            </>}

                                    </div>
                                </div>
                                <h1 className="pl-1 text-[1rem] tracking-wider font-semibold text-gray-300 mt-1  max-w-[90%]">{task?.title}</h1>
                            </div>

                            {/* # Priority and Due Date */}
                            <div className="pl-1  flex items-center justify-start mt-2 gap-3 ">
                                <div
                                    className={`inline-flex  rounded-md px-2 text-[10px]  tracking-widest ${priorityStyles[task?.Priority ?? "N_A"]}`} >
                                    {task?.Priority}
                                </div>



                                <div className="px-1 flex items-center gap-1 text-gray-400 rounded-md border-2 border-bg-lg_grey">
                                    <CalendarPlus size={14} />
                                    <p className="text-xs">{formatTaskDate(task?.createdAt)}</p>
                                </div>
                            </div>

                            {/* #Info indicators */}
                            <div className={`px-1   grid gap-3  ${isExpanded ? "grid-cols-4 mt-3" : "grid-cols-2 mt-2"}`}>

                                {/* #Status */}
                                <div className=" p-2 bg-lg_grey/20 rounded-md">
                                    <p className="text-gray-400 text-[10px] tracking-widest">STATUS</p>
                                    <div className="p-1 px-2 tracking-widest text-[0.8rem] flex items-center gap-2   ">
                                        <span className={` inline-block h-2 w-2 rounded-full ${statusStyles[task?.column?.type ?? "CUSTOM"].dot}`} />
                                        {task?.column.name}</div>
                                </div>

                                {/* #Estimate */}
                                <div className="p-2 bg-lg_grey/20 rounded-md">
                                    <p className="text-gray-400 text-[10px] tracking-widest">ESTIMATE</p>
                                    <div className="p-1 px-2 flex items-center gap-2 ">
                                        <Clock size={18} className="text-yellow-600" />
                                        <p className=" tracking-wider"> {formatEstimate(task?.estimate ?? 0)}</p>
                                    </div>
                                </div>

                                {/* #Progress % */}
                                <div className="p-2 bg-lg_grey/20 rounded-md">
                                    <p className="text-gray-400 text-[10px] tracking-widest">PROGRESS</p>
                                    <div className="p-1 px-2 flex gap-3 items-center ">
                                        < div className="flex h-5 w-5 items-center justify-center rounded-full"
                                            style={{
                                                background: `conic-gradient(#398b57 ${task?.progress}%, #2b2b2b ${task?.progress}%)`,
                                            }}  >
                                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[rgb(24,25,26)] text-[10px] text-white">

                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-gray-300 text-xs tracking-widest flex flex-col">{task?.progress}%
                                                <span className="text-[11px] leading-3 text-gray-400">completed</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* #Assignee */}
                                <div className="p-2 bg-lg_grey/20 rounded-md">
                                    <p className="text-gray-400 text-[10px] tracking-widest">ASSIGNEE</p>
                                    <div className="p-1 flex  items-center gap-2 h-9">
                                        <Image
                                            src={task?.assignedTo.avatar ?? ""}
                                            alt={task?.assignedTo.name ?? "image"}
                                            width={25}
                                            height={25}

                                            className="cursor-pointer rounded-full border border-dk_grey"
                                        />
                                        <p className=" line-clamp-1">{task?.assignedTo.name}</p>
                                    </div>
                                </div>

                            </div>


                            <div className=" mx-1 mt-2 flex-1 ">
                                <TaskTabs taskId={task?.id ?? ""} />
                            </div>



                            {/* CANCEL & SAVE BUTTONS */}

                            {isEditMode &&
                                <div className="sticky mt-[8rem] border-t border-white/[0.06]  px-5 py-4 transition-all ease-in-out duration-200">
                                    <div className={`grid ${isExpanded ? "grid-cols-4" : "grid-cols-2"}   gap-3`}>
                                        {/* CANCEL */}
                                        <button className={`flex h-8 min-w-[130px] items-center justify-center rounded-sm border border-gray-700 gap-2 px-5 text-sm font-medium tracking-widest text-gray-300 bg-lg_grey/10 hover:text-gray-200 hover:bg-lg_grey/30  ${isExpanded ? " col-start-3" : ""}`} onClick={() => setIsEditMode(false)} >
                                            <X size={16} />
                                            Cancel
                                        </button>

                                        {/* SAVE */}
                                        <button className="flex h-8 min-w-[130px] items-center justify-center gap-2 rounded-sm border border-purple-900 bg-lg_grey/20 px-5 text-sm font-medium tracking-widest text-purple-500  hover:text-purple-400 hover:border-purple-800 hover:bg-lg_grey/30"  >
                                            <Check size={16} />
                                            Save
                                        </button>
                                    </div>
                                </div>
                            }




                        </div>
                    </div>
                </div>
            </SheetContent>

        </Sheet>
    );
};

export default TaskDetailsSheet;