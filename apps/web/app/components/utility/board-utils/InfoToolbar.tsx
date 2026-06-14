import { InfoToolbarProps } from '@/app/types/general.types'
import {
  CircleCheckBig,
  ClipboardList,
  TriangleAlert,
  Users,
} from 'lucide-react'
import React from 'react'

const InfoToolbar = ({ blockedCount, totalTasks }: InfoToolbarProps) => {
  return (
    <div>
      <div className="grid grid-cols-2 px-2">
        <div className="grid grid-cols-[0.5fr_2fr] ">
          <div className=" flex items-center gap-2 text-sm tracking-wider text-gray-400">
            <ClipboardList size={20} className="text-purple-700" />
            {totalTasks} Tasks
          </div>
          {blockedCount > 0 ? (
            <div className=" flex items-center gap-2 text-sm tracking-wide text-gray-400">
              {' '}
              <TriangleAlert size={16} className="text-yellow-500" />{' '}
              {blockedCount} task need attention
            </div>
          ) : (
            <div className=" flex items-center gap-2 text-sm tracking-wide text-gray-400">
              {' '}
              <CircleCheckBig size={16} className="text-green-600" /> No active
              issues
            </div>
          )}
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default InfoToolbar
