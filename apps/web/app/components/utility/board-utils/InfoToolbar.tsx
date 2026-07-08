import { InfoToolbarProps } from '@/app/types/general.types'
import {
  CircleCheckBig,
  ClipboardList,
  RefreshCcw,
  RefreshCw,
  TriangleAlert,
  Users,
} from 'lucide-react'
import React from 'react'

const InfoToolbar = ({
  blockedCount,
  totalTasks,
  pendingUpdateCount,
  handleSyncUpdates,
  isSyncing,
}: InfoToolbarProps) => {
  return (
    <div className="">
      <div className="grid grid-cols-1 px-2 ">
        <div className="grid grid-cols-[0.3fr_0.5fr_2fr] ">
          <div className=" flex items-center gap-2 text-sm tracking-wider text-gray-400 p-1">
            <ClipboardList size={20} className="text-purple-700" />
            {totalTasks} Tasks
          </div>
          {blockedCount > 0 ? (
            <div className=" flex items-center gap-2 text-sm tracking-wide text-gray-400 p-1">
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

          {pendingUpdateCount > 0 && (
            <div className=" flex items-center gap-2 text-xs tracking-wider text-gray-400">
              {' '}
              <RefreshCw
                size={14}
                className={`text-blue-500 ${isSyncing ? 'animate-spin' : ''}`}
              />
              <span> {pendingUpdateCount} pending updates</span>
              <span
                className="text-purple-500 p-1 px-3 rounded-md tracking-widest cursor-pointer bg-purple-600/10"
                onClick={handleSyncUpdates}
              >
                {isSyncing ? 'syncing...' : 'sync'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InfoToolbar
