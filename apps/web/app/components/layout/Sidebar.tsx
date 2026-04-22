// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const links = [
//     { name: "Dashboard", href: "/" },
//     { name: "Tasks", href: "/tasks" },
//     { name: "Calendar", href: "/calendar" },
//     { name: "AI Insight", href: "/ai-insight" },
//     { name: "Boards", href: "/boards" },
//     { name: "Settings", href: "/settings" },
// ];

// export default function Sidebar() {
//     const path = usePathname();

//     return (
//         <div className="w-[14rem] bg-dk_grey p-4 bd_grn">




//             {links.map((link) => (
//                 <Link key={link.name} href={link.href}>
//                     <div
//                         className={`p-2 rounded cursor-pointer ${path === link.href ? "bg-slate-50" : ""
//                             }`}
//                     >
//                         {link.name}
//                     </div>
//                 </Link>
//             ))}
//         </div>
//     );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Info } from 'lucide-react';


export default function Sidebar() {
    const path = usePathname();

    const [userEmail, setUserEmail] = useState("member@test.com")

    return (
        <aside className="w-[14rem]  bg-dk_grey p-2 flex flex-col justify-between border-r border-r-dk_border">

            {/*  SECTION 1: LOGO + SEARCH  */}
            <div className=" ">
                {/* Logo / Workspace */}
                <div className="flex items-center justify-between cursor-pointer p-2 border-2 border-dk_border rounded-md mb-5">
                    <div className="bg-purple-950  rounded-md">
                        <img className=" w-10 h-9 p-1  rotate-12 " src="/images/logo1.png" alt="image" />
                    </div>
                    <div className="flex-1 ml-2 ">
                        <p className="text-sm font-semibold tracking-[3px]">ZENTRO</p>
                        <p className="text-xs opacity-60">{userEmail}</p>
                    </div>
                    <div>
                        <Info size={18} />
                    </div>
                </div>

                {/* Search Input */}
                {/* <div className="mb-6 ">
                    <input
                        type="text"
                        placeholder="🔍 Search"
                        className="w-full px-3 py-2 rounded-md bg-black/20 outline-none"
                    />
                </div> */}
            </div>

            {/*  -------------------------- */}

        </aside>
    );
}