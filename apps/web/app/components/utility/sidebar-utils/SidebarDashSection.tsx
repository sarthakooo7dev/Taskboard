import { Calendar, CheckSquare, ChevronDown, Presentation, Clock, LayoutDashboard, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import { SIDEBAR_CONFIG } from '../../../config/sidebar.config';

const SidebarDashSection = () => {

    const [open, setOpen] = useState(true);
    const path = usePathname();


    const dashItems = SIDEBAR_CONFIG[0]?.items;
    ;
    return (
        <div className="w-full ">
            {/* Header */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full px-3 py-2 text-xs text-gray-400 rounded-md"
            >
                <span className="flex items-center gap-2 tracking-[1px]">
                    Dashboard
                </span>

                <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* Collapsible Content */}
            <div
                className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 mt-1" : "max-h-0"
                    }`}
            >
                <div className="flex flex-col gap-1">
                    {dashItems?.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <Link key={item.label} href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 text-sm text-gray-400 tracking-[1px]
                            ${path === item.href ? "bg-lg_grey text-white/80 " : " hover:bg-lg_grey/30"} rounded-md`} >
                                <Icon size={16} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default SidebarDashSection