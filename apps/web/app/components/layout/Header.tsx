"use client"

import { usePathname } from 'next/navigation'
import React from 'react'
import { SIDEBAR_CONFIG } from '../../config/sidebar.config'
import ThemeToggle from '../utility/header-utils/ThemeToggle'
import Notify from '../utility/header-utils/Notify'

const Header = () => {

    const path = usePathname()
    const headerInfo = SIDEBAR_CONFIG[0]?.items.find((val) => val.href === path);
    const title = headerInfo?.label;
    const info = headerInfo?.info;

    return (
        <div className='flex justify-center border-b border-b-dk_border p-2 h-[4rem] bg-dk_grey'>

            <div className='flex-1 '>
                <h2 className='text-lg font-semibold opacity-90 tracking-[1px] '>{title}</h2>
                <p className='text-sm text-gray-400'>{info}</p>
            </div>
            <div className=' flex justify-end  items-center p-1 w-[20%] gap-3'>
                <ThemeToggle />

                <Notify />
            </div>

        </div>
    )
}

export default Header