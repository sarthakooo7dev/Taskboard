"use client";

import { TaskDetailsSheetProps } from "@/app/types/general.types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, } from "@/components/ui/sheet";
import { ArrowRightFromLine, FoldHorizontal, Maximize2, Zap } from "lucide-react";
import { useState } from "react";

const TaskDetailsSheet = ({ openTask, onOpenChange, task }: TaskDetailsSheetProps) => {

    const [isExpanded, setIsExPanded] = useState<boolean>(false)


    return (
        <Sheet open={openTask} onOpenChange={onOpenChange} >
            <SheetContent side="right" className={`w-full border-l border-white/[0.06] bg-dk_grey p-0
                     text-gray-400 transition-all duration-300 ease-in-out ${isExpanded ? "sm:!max-w-[60%]" : "sm:!max-w-[30%]"}`}>

                <div className="flex h-full flex-col">
                    {/* HEADER */}
                    <SheetHeader className="border-b border-white/[0.06] px-3 py-4">
                        <SheetTitle className="text-left  w-[92%] tracking-wider  ">

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


                        </SheetTitle>
                    </SheetHeader>

                    {/* BODY */}
                    <div className="flex-1 overflow-y-auto p-2">
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                            <p className="text-sm tracking-wide text-gray-400">
                                Task details will come here.
                            </p>
                        </div>
                    </div>
                </div>
            </SheetContent>

        </Sheet>
    );
};

export default TaskDetailsSheet;