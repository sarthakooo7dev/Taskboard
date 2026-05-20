"use client";

import { useState } from "react";

import {
    MessageSquare,
    Activity,
    Paperclip,
} from "lucide-react";


type TaskTabsProps = {

    taskId: string;
};


const TaskTabs = ({
    taskId,
}: TaskTabsProps) => {

    // Current active tab
    const [
        activeTab,
        setActiveTab,
    ] = useState<
        "comments" |
        "activity"
    >("comments");



    return (

        <div className="flex h-full min-h-0  flex-col rounded-sm border border-lg_grey">

            {/* TAB HEADER */}
            <div className="  flex items-center gap-6 border-b border-white/[0.06] px-3 pt-1 ">

                {/* COMMENTS TAB */}
                <button onClick={() => setActiveTab("comments")} className={` relative flex items-center gap-1 border-b pb-1 text-[0.8rem]  tracking-wider transition-colors duration-200  ${activeTab === "comments" ? "border-purple-700 text-purple-500 " : "border-transparent text-gray-500 hover:text-gray-400"} `} >
                    <MessageSquare size={12} />
                    Comments
                </button>

                {/* ACTIVITY TAB */}
                <button onClick={() => setActiveTab("activity")}
                    className={` relative flex items-center gap-1 border-b pb-1 text-[0.8rem]  tracking-wider transition-colors duration-200  ${activeTab === "activity" ? "border-purple-700 text-purple-500 " : "border-transparent text-gray-500 hover:text-gray-400"} `} >
                    <Activity size={12} />
                    Activity
                </button>

            </div>



            {/* TAB BODY */}
            <div className="flex-1  overflow-y-auto  ">

                {/* COMMENTS TAB */}
                {activeTab === "comments" &&

                    <div className=" ">
                    </div>}

                {/* ACTIVITY TAB */}
                {activeTab === "activity" && (<div></div>)}

            </div>

        </div>
    );
};

export default TaskTabs;