'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { SIDEBAR_CONFIG } from '../../config/sidebar.config'
import ThemeToggle from '../utility/header-utils/ThemeToggle'
import Notify from '../utility/header-utils/Notify'
import CreateBoardBtn from '../utility/header-utils/CreateBoardBtn'
import { useBoardStore } from '@/app/store/board-store'
import { useUserStore } from '@/app/store/user-store'
import { useSession } from 'next-auth/react'

const Header = () => {
  const path = usePathname()
  const boardTitle = useSearchParams().get('title')

  const segments = path.split('/').filter(Boolean)

  const isBoardpage =
    segments[0] === 'dashboard' &&
    segments[1] === 'boards' &&
    segments.length === 3
  const isWorkspacePage =
    segments[0] === 'dashboard' &&
    segments[1] === 'boards' &&
    segments.length === 2

  const boardDesc = useBoardStore().currentBoard?.description ?? ''
  const isDemo = useUserStore().user?.email === 'demo@klyro.com'
  const headerInfo = SIDEBAR_CONFIG[0]?.items.find((val) => val.href === path)
  const title = isBoardpage ? boardTitle : headerInfo?.label
  const info = isBoardpage ? boardDesc : headerInfo?.info
  console.log(useUserStore().user?.email)
  return (
    <div className="flex justify-center border-b border-b-dk_border p-2 h-[4rem] bg-dk_grey">
      <div className="flex-1 ">
        <h2 className="text-lg font-semibold opacity-90 tracking-[1px] text-gray-300 ">
          {title}
        </h2>
        <p className="text-sm text-gray-400 tracking-wide w-[75ch] line-clamp-1">
          {info}
        </p>
      </div>
      <div className=" flex justify-end  items-center p-1 w-[50%] gap-3 ">
        {isDemo && (
          <div className="flex items-center gap-2 rounded-full border border-purple-600/50 px-3 py-1 mr-5">
            <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-medium tracking-widest text-purple-400/70">
              Demo Workspace
            </span>
          </div>
        )}

        {isWorkspacePage && <CreateBoardBtn />}

        {/* <ThemeToggle /> */}

        <Notify />
      </div>
    </div>
  )
}

export default Header
