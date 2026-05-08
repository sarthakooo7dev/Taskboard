"use client"

import { usePathname, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { SIDEBAR_CONFIG } from '../../config/sidebar.config'
import ThemeToggle from '../utility/header-utils/ThemeToggle'
import Notify from '../utility/header-utils/Notify'
import CreateBoardBtn from '../utility/header-utils/CreateBoardBtn'

const Header = () => {

    const path = usePathname()
    const boardTitle = useSearchParams().get("title");

    const segments = path.split("/").filter(Boolean);

    const isBoardpage = (segments[0] === "dashboard" && segments[1] === "boards" && segments.length === 3);
    const isWorkspacePage = (segments[0] === "dashboard" && segments[1] === "boards" && segments.length === 2);


    const headerInfo = SIDEBAR_CONFIG[0]?.items.find((val) => val.href === path);
    const title = isBoardpage ? boardTitle : headerInfo?.label;
    const info = isBoardpage ? "" : headerInfo?.info;
    console.log(isBoardpage + "----" + title + "----" + info)

    return (
        <div className='flex justify-center border-b border-b-dk_border p-2 h-[4rem] bg-dk_grey'>

            <div className='flex-1 '>
                <h2 className='text-lg font-semibold opacity-90 tracking-[1px] '>{title}</h2>
                <p className='text-sm text-gray-400'>{info}</p>
            </div>
            <div className=' flex justify-end  items-center p-1 w-[30%] gap-3 '>

                {isWorkspacePage && <CreateBoardBtn />}

                <ThemeToggle />

                <Notify />
            </div>

        </div>
    )
}

export default Header