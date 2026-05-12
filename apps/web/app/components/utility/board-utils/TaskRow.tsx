"use client";

import Image from "next/image";

import { MoreHorizontal, MessageCircle, ChevronDown, MessageCircleMore } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { TableCell, TableRow, } from "@/components/ui/table";
import { TaskRowProps } from "@/app/types/general.types";
import { formatEstimate, priorityStyles, statusStyles } from "@/app/lib/utils/ui/boardHelpers";



const TaskRow = ({ task, availableStatus }: TaskRowProps) => {

    const truncateDescription = (desc: string) => {
        if (desc.length <= 60) {
            return desc;
        }
        const sliced = desc.slice(0, 60);
        const lastSpaceIndex = sliced.lastIndexOf(" ");
        return sliced.slice(0, lastSpaceIndex) + "...";
    };


    return (

        <TableRow className=" border-b border-white/[0.04] transition-all duration-200 hover:bg-lg_grey/15 text-center">
            <TableCell className="truncate cursor-pointer w-[35%] ">
                <div className="flex  flex-col items-start  ">
                    <h3 className="text-sm font-medium tracking-wider text-gray-300">
                        {task.title}
                    </h3>
                    <p className="overflow-hidden text-xs leading-5  text-gray-400">
                        {truncateDescription(task.description)}
                    </p>
                </div>
            </TableCell>


            <TableCell className="w-[150px]">
                <div className="flex justify-center ">
                    <Select defaultValue={task.column.name} onValueChange={(value) => { console.log(value) }}  >

                        <SelectTrigger className="h-8 w-[130px] border border-white/[0.06] bg-white/[0.02] text-xs text-gray-200 shadow-none transition-all duration-200 hover:bg-white/[0.04] focus:ring-0">
                            <div className="flex items-center  overflow-hidden gap-2">
                                <SelectValue>
                                </SelectValue>
                            </div>

                        </SelectTrigger>

                        <SelectContent className=" p-2  bg-dk_grey text-gray-300 cursor-pointer ">
                            {availableStatus.map((val) => {
                                return <>
                                    <SelectItem key={val.id} value={val.name} className="border-none focus:bg-lg_grey/50 focus:text-white focus:outline-none  focus:ring-0  data-[highlighted]:bg-lg_grey/50 data-[highlighted]:text-gray-200 cursor-pointer">

                                        <div className=" flex items-center gap-2 tracking-wider">
                                            <span className={`h-2 w-2 rounded-full  ${statusStyles[val.type].dot}`} />
                                            <span className="">{val.name}</span>
                                        </div>
                                    </SelectItem>
                                </>
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </TableCell>

            <TableCell className="w-[130px] ">
                <div className="flex items-center justify-between">
                    <div className="border border-lg_grey h-[6px] min-w-[90px] ">
                        <div className="h-full rounded-full bg-green-400/70 transition-all duration-300"
                            style={{ width: `${task.progress}%` }}>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-300 tracking-wider">{task.progress}%</p>
                </div>
            </TableCell>


            <TableCell className="w-[80px] ">
                <div className="flex justify-center items-center" >
                    <Image
                        src={task.assignedTo.avatar}
                        alt={task.assignedTo.name}
                        width={25}
                        height={25}
                        title={task.assignedTo.name}
                        className="rounded-full border border-dk_grey cursor-pointer"
                    />
                </div>
            </TableCell>



            <TableCell className="w-[80px] ">
                <span className="text-sm font-medium text-gray-400">
                    {formatEstimate(task.estimate)}
                </span>
            </TableCell>

            <TableCell className="w-[90px] ">
                <div className="flex justify-center text-gray-400">
                    <MessageCircleMore size={16} className="" />
                    <p className=" pl-1 text-sm mt-[-1px]">
                        {task?._count?.comments}
                    </p>
                </div>
            </TableCell>

            <TableCell className="w-[90px] text-left  ">
                <div className={`ml-3 inline-flex rounded-md px-2 py-0 text-[11px] tracking-widest ${priorityStyles[task.Priority]}`}>
                    {task.Priority}
                </div>

            </TableCell>

            <TableCell className="w-[35px] ">
                <button className="transition-all duration-200 hover:text-white group-hover:opacity-100">

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