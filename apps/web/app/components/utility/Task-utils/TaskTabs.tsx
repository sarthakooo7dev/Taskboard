"use client";

import { useState } from "react";
import { MessageSquare, Activity, Paperclip, } from "lucide-react";
import CommentsTab from "./CommentsTab";
import { TaskTabsProps } from "@/app/types/general.types";




const TaskTabs = ({ taskId, boardId, isEditMode }: TaskTabsProps) => {

    // Current active tab
    const [activeTab, setActiveTab,] = useState<"comments" | "activity">("comments");
    const [count, setCount] = useState(0)

    return (

        <div className="flex h-full min-h-0  flex-col rounded-sm border border-lg_grey">

            {/* TAB HEADER */}
            <div className="  flex items-center gap-6 border-b border-white/[0.06] px-3 pt-1 ">

                {/* COMMENTS TAB */}
                <button onClick={() => setActiveTab("comments")} className={` relative flex items-center gap-1 border-b pb-1 text-[0.8rem]  tracking-wider transition-colors duration-200  ${activeTab === "comments" ? "border-purple-700 text-purple-500 " : "border-transparent text-gray-500 hover:text-gray-400"} `} >
                    <MessageSquare size={12} />
                    Comments {count > 0 && <span>({count})</span>}
                </button>

                {/* ACTIVITY TAB */}
                <button onClick={() => setActiveTab("activity")}
                    className={` relative flex items-center gap-1 border-b pb-1 text-[0.8rem]  tracking-wider transition-colors duration-200  ${activeTab === "activity" ? "border-purple-700 text-purple-500 " : "border-transparent text-gray-500 hover:text-gray-400"} `} >
                    <Activity size={12} />
                    Activity
                </button>

            </div>



            {/* TAB BODY */}
            <div className="flex-1 min-h-0  overflow-y-auto  ">

                {/* COMMENTS TAB */}
                {activeTab === "comments" && <CommentsTab taskId={taskId} boardId={boardId} setCount={setCount} isEditMode={isEditMode} />}

                {/* ACTIVITY TAB */}
                {activeTab === "activity" && (<div></div>)}

            </div>

        </div>
    );
};

export default TaskTabs;