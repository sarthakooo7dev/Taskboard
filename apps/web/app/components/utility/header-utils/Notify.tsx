"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";


const Notify = () => {
    const count = 15;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className="relative px-3 h-8 rounded-md bg-dk_grey border border-[rgb(50,49,54)]
                     hover:bg-lg_grey transition flex items-center justify-center"
                    aria-label="Notifications"
                >
                    <Bell size={16} />

                    {/* 🔵 Badge */}
                    {count > 0 && (
                        <span
                            className="absolute -top-2 -right-2 min-w-[15px] h-[17px] p-[7px] 
                         bg-purple-800 text-gray-200 text-[11px] 
                         flex items-center justify-center rounded-full leading-none"
                        >
                            {count > 7 ? "7+" : count}
                        </span>
                    )}
                </button>
            </PopoverTrigger>

            {/*  Popover Content */}
            <PopoverContent
                side="bottom"
                align="end"
                className="w-72 p-0 bg-dk_grey border border-dk_border z-50"
            >
                {/* Header */}
                <div className="px-3 py-2 border-b border-dk_border text-sm font-medium text-gray-400 tracking-[1px]">
                    Notifications
                </div>

                {/* Body */}
                <div className="max-h-80 overflow-y-auto">
                    <div className="p-3 text-sm text-gray-400">
                        No new notifications
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default Notify;