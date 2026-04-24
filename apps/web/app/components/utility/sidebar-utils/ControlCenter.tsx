import React from 'react'
import { CONTROL_CENTER_CONFIG } from '../../../config/control.center.config'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ControlCenter = () => {

    const path = usePathname();
    const sidebarItems = CONTROL_CENTER_CONFIG[0]?.items;

    return (
        <div className=' '>
            <div className="flex flex-col gap-1">
                {sidebarItems?.map((item) => {
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
    )
}

export default ControlCenter