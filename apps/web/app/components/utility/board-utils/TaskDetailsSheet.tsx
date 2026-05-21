"use client";

import { calculateProgress, formatEstimate, formatTaskDate, priorityStyles, priorityTextStyles, statusStyles } from "@/app/lib/utils/ui/boardHelpers";
import { TaskDetailsSheetProps, TaskItem, TaskStatus } from "@/app/types/general.types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, } from "@/components/ui/sheet";
import { ArrowRightFromLine, CalendarClock, CalendarPlus, Check, Clock, Divide, Dot, FoldHorizontal, Maximize2, Minus, Pencil, Plus, X, Zap } from "lucide-react";
import Image from "next/image";
import { title } from "process";
import { useEffect, useState } from "react";
import TaskTabs from "../Task-utils/TaskTabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ifError } from "assert";

const TaskDetailsSheet = ({ openTask, onOpenChange, task, isEditMode, setIsEditMode, availableStatus }: TaskDetailsSheetProps) => {

    const [isExpanded, setIsExPanded] = useState<boolean>(false)
    const [priority, setPriority] = useState(task?.Priority);
    const [status, setStatus] = useState(task?.column.name)
    const [progress, setProgress] = useState<number>(task?.progress ?? 0)
    const [isTitleEdit, setIsTitleEdit] = useState<boolean>(false)
    const [isStatusEdit, setIsStatusEdit] = useState<boolean>(false)
    const [isEstimateEdit, setIsEstimateEdit] = useState<boolean>(false)
    const [isprogressEdit, setIsProgressEdit] = useState<boolean>(false)

    const taskEstimate = formatEstimate(task?.estimate ?? 0);

    console.log(openTask)
    useEffect(() => {

        console.log(priority + "----" + progress + "----" + status)
        if (openTask) {
            setPriority(task?.Priority);
            setStatus(task?.column.name)

            setProgress(task?.progress ?? 0)
            closeEditMode()
        }

    }, [openTask]);

    const handleStatusChange = (selectedStatusId: string) => {

        const selectedColumn = availableStatus.find((status) => status.id === selectedStatusId);
        if (!selectedColumn || !task?.Priority) return
        let updatedProgress = calculateProgress(selectedColumn, task?.progress)
        setProgress(updatedProgress)
    }

    const closeEditMode = () => {
        setIsEditMode(false)
        setIsTitleEdit(false)
        setIsStatusEdit(false)
        setIsEstimateEdit(false)
        setIsProgressEdit(false)
    }

    const enableEditMode = () => {
        setIsEditMode(true)
    }

    const handleCancel = () => {
        setProgress(task?.progress ?? 0)
        setPriority(task?.Priority);
        setStatus(task?.column.name)
        closeEditMode()
    }

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
                    <div className="flex-1 overflow-y-auto px-2 pt-1 bd_grn">
                        <div className=" h-full  flex flex-col  ">

                            {/* # title container */}
                            <div className="  flex flex-col items-start">
                                <div className="w-full tracking-wider text-sm  flex items-center justify-between  text-gray-500 gap-1 ">
                                    <div className="flex items-center gap-1  ">
                                        <Zap size={13} className="text-purple-400" />
                                        <p>Task</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-400 tracking-widest text-[0.8rem] cursor-pointer hover:text-gray-300" onClick={enableEditMode}>
                                        {!isEditMode &&
                                            <>
                                                <Pencil size={12} />
                                                <p>Edit</p>
                                            </>}

                                    </div>
                                </div>
                                {isTitleEdit ?
                                    <textarea className="ml-1 p-1 w-full bg-transparent text-[1rem] tracking-wider font-semibold  mt-1 text-gray-300 max-w-[90%] border border-purple-900 outline-none focus:outline-none focus:ring-0" defaultValue={task?.title} />
                                    :
                                    <div className="flex justify-between ">
                                        <h1 className="p-1  text-[1rem] tracking-wider font-semibold text-gray-300 mt-1  max-w-[90%]">{task?.title} </h1> {isEditMode && <Pencil size={12} className="mt-2 mr-3 cursor-pointer" onClick={() => setIsTitleEdit(true)} />}
                                    </div>
                                }


                            </div>

                            {/* # Priority and Due Date */}
                            <div className="pl-1  flex items-center justify-start mt-2 gap-3 ">
                                {
                                    isEditMode ? (
                                        <Select defaultValue={task?.Priority} onValueChange={(value) =>
                                            setPriority(value as "LOW" | "MEDIUM" | "HIGH")}>
                                            <SelectTrigger
                                                className={` min-w-[90px] border-white/10  text-[11px] tracking-widest shadow-none focus:ring-0  ${priorityTextStyles[priority ?? "N_A"]}`}  >
                                                <SelectValue />
                                            </SelectTrigger>

                                            <SelectContent position="popper" align="start" className="bg-dk_grey  bg-[#111] text-gray-300">
                                                <SelectItem value="LOW" className=" hover:bg-lg_grey/20 hover:text-gray-100 tracking-widest text-[12px] cursor-pointer">LOW</SelectItem>

                                                <SelectItem value="MEDIUM" className=" hover:bg-lg_grey/20 hover:text-gray-100  tracking-widest text-[12px] cursor-pointer">MEDIUM</SelectItem>

                                                <SelectItem value="HIGH" className=" hover:bg-lg_grey/20 hover:text-gray-100 tracking-widest text-[12px] cursor-pointer">HIGH</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className={`inline-flex rounded-md px-2  text-[10px] tracking-widest ${priorityStyles[task?.Priority ?? "N_A"]}`}>
                                            {task?.Priority}
                                        </div>
                                    )
                                }


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
                                    {
                                        isStatusEdit ?
                                            <Select
                                                defaultValue={task?.column.id}
                                                onValueChange={handleStatusChange} >
                                                <SelectTrigger className="relative h-5 w-full max-w-[130px] border border-white/[0.06] bg-white/[0.02] text-xs text-gray-200 shadow-none transition-colors duration-200 focus:ring-0">
                                                    <SelectValue />
                                                </SelectTrigger>

                                                <SelectContent position="popper" align="start" className="cursor-pointer bg-dk_grey p-2 text-gray-300">
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
                                            </Select> : <div className="p-1 px-2 tracking-widest text-[0.8rem] flex items-center gap-2 ">
                                                <span className={` inline-block h-2 w-2 rounded-full ${statusStyles[task?.column?.type ?? "CUSTOM"].dot}`} />
                                                {task?.column.name} {isEditMode && <Pencil size={12} className="ml-3 mt-[-4px] cursor-pointer" onClick={() => setIsStatusEdit(true)} />}  </div>
                                    }


                                </div>

                                {/* #Estimate */}
                                <div className="p-2 bg-lg_grey/20 rounded-md">
                                    <p className="text-gray-400 text-[10px] tracking-widest">ESTIMATE</p>
                                    <div className="p-1 px-2 flex items-center gap-2 ">
                                        <Clock size={18} className="text-yellow-600" />

                                        {
                                            isEstimateEdit ? <div className="flex gap-2 "> <input type="text" defaultValue={taskEstimate} className="w-[50px] bg-transparent border  border-yellow-900 px-1 outline-none focus:outline-none focus:ring-0" />
                                                <p className="text-[10px] tracking-wider"> Eg. 2h,4d,3w</p>
                                            </div>
                                                :
                                                <div className="flex items-center ">
                                                    <p className=" tracking-wider"> {taskEstimate}</p>
                                                    {isEditMode && <Pencil size={12} className="ml-4 mt-[-4px] cursor-pointer" onClick={() => setIsEstimateEdit(true)} />}
                                                </div>

                                        }

                                    </div>
                                </div>

                                {/* #Progress % */}
                                <div className="p-2 bg-lg_grey/20 rounded-md">
                                    <p className="text-gray-400 text-[10px] tracking-widest">PROGRESS</p>
                                    <div className="p-1 px-2 flex gap-3 items-center ">
                                        < div className="flex h-5 w-5 items-center justify-center rounded-full"
                                            style={{
                                                background: `conic-gradient(#398b57 ${progress}%, #2b2b2b ${progress}%)`,
                                            }}  >
                                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[rgb(24,25,26)] text-[10px] text-white">

                                            </div>
                                        </div>
                                        {isprogressEdit ?
                                            <div className="flex gap-3 items-center cursor-pointer">
                                                <Minus size={16} className="text-gray-100"
                                                    onClick={() => setProgress((prev) => Math.max(prev - 10, 0))} />

                                                <input type="text" className="w-[34px] h-[20px] px-1 text-center bg-transparent rounded-sm border  border-gray-500 outline-none focus:outline-none focus:ring-0 text-[12px]" defaultValue={progress} value={progress} onChange={(e) => setProgress(Number(e.target.value))} />

                                                <span className="ml-[-7px]">%</span>

                                                <Plus size={16} className="text-gray-100"
                                                    onClick={() => setProgress((prev) => Math.min(prev + 10, 100))} />
                                            </div>
                                            :
                                            <div className="flex gap-3">
                                                <p className="text-gray-300 text-xs tracking-widest flex flex-col">{progress}%
                                                    <span className="text-[11px] leading-3 text-gray-400">completed</span></p>
                                                {isEditMode && <Pencil size={12} className="ml-5 cursor-pointer" onClick={() => setIsProgressEdit(true)} />}
                                            </div>}

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


                            <div className=" mx-1 mt-2 mb-1 flex-1 ">
                                <TaskTabs taskId={task?.id ?? ""} />
                            </div>



                            {/* CANCEL & SAVE BUTTONS */}

                            {isEditMode &&
                                <div className="sticky  px-2 pt-1 pb-1 transition-all ease-in-out duration-200">
                                    <div className={`grid ${isExpanded ? "grid-cols-4" : "grid-cols-2"}   gap-3`}>
                                        {/* CANCEL */}
                                        <button className={`flex h-8 min-w-[130px] items-center justify-center rounded-sm border border-gray-700 gap-2 px-5 text-sm font-medium tracking-widest text-gray-300 bg-lg_grey/10 hover:text-gray-200 hover:bg-lg_grey/30  ${isExpanded ? " col-start-3" : ""}`}
                                            onClick={handleCancel} >
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