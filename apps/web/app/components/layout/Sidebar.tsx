"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Info } from 'lucide-react';
import { useUserStore } from "../../store/user-store";
import Search from "../utility/sidebar-utils/Search";
import SidebarDashSection from "../utility/sidebar-utils/SidebarDashSection";
import { useRouter } from "next/navigation";
import { ROUTES } from "../../lib/ui.routes";
import ControlCenter from "../utility/sidebar-utils/ControlCenter";
import UserCard from "../utility/sidebar-utils/UserCard";

export default function Sidebar() {
    const path = usePathname();
    const user = useUserStore((s) => s.user);
    const router = useRouter();


    const handleLogoCard = () => {
        router.push(ROUTES.dashboard)
    }

    return (
        <aside className="w-[14rem]  bg-dk_grey p-2 flex flex-col  border-r border-r-dk_border  overflow-y-auto minimal-scrollbar">

            {/*  SECTION 1: LOGO + SEARCH  */}
            <div className=" ">
                {/* Logo / Workspace */}
                <div className="flex items-center justify-between cursor-pointer p-2 border-2 border-dk_border rounded-md mb-5 " onClick={handleLogoCard}>
                    <div className="bg-purple-950  rounded-md">
                        <img className=" w-10 h-9 p-1  rotate-12 " src="/images/logo1.png" alt="image" />
                    </div>
                    <div className="flex-1 ml-2 ">
                        <p className="text-sm font-semibold tracking-[3px]">ZENTRO</p>
                        <p className="text-xs w-[16ch] overflow-hidden whitespace-nowrap text-gray-400">{user?.email}</p>
                    </div>
                    <div>
                        <div className="
                  text-xs p-[3px] rounded-md bg-[rgb(50,49,54)] border-2 border-[rgb(50,49,54)] text-white/60">

                            <Info size={13} />
                        </div>
                    </div>
                </div>

                {/* Search Input */}
                <Search />
            </div>

            {/*  -------------------------- */}

            {/*  SECTION 2: Dashboard collapsible comp */}

            <SidebarDashSection />
            {/*  -------------------------- */}

            {/*  SECTION 3: control_center & user card */}

            <div className=" h-full flex flex-col justify-end ">

                <ControlCenter />

                <UserCard />

            </div>
            {/*  -------------------------- */}
        </aside>
    );
}