'use client'

import React, { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { useUserStore } from '@/app/store/user-store'
import { socket } from '@/app/lib/socket'
import { formatNotification } from '@/app/lib/utils/ui/notificationFormatter'
import { useRouter } from 'next/navigation'

const Notify = () => {
  const [notifications, setNotifications] = useState<any[]>([])
  const count = notifications.length
  const { user } = useUserStore()
  const router = useRouter()
  useEffect(() => {
    if (!user?.id) return
    socket.emit('REGISTER', {
      userId: user?.id,
    })

    socket.on('notification', (notification) => {
      console.log(notification)

      setNotifications((prev) => [notification, ...prev])
    })

    return () => {
      socket.off('notification')
    }
  }, [user?.id])

  const handleNav = (taskId: string, boardTitle: string, boardId: string) => {
    router.push(
      `/dashboard/boards/${boardId}?title=${encodeURIComponent(
        boardTitle,
      )}&taskId=${taskId}`,
    )
  }

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
              {count > 7 ? '7+' : count}
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
          <div className="p-3 text-sm text-gray-400">No new notifications</div>
          {notifications.map((val) => {
            const item = formatNotification(val, user!.id)
            const Icon = item.icon
            return (
              <div className="p-2 text-gray-400 text-xs">
                {' '}
                <p
                  className="cursor-pointer flex items-start p-1 bd_grn"
                  onClick={() =>
                    handleNav(item.entityId, item.boardTitle, item.boardId)
                  }
                >
                  <span className="pt-0.5 pr-0.5">
                    <Icon size={12} />
                  </span>{' '}
                  {item.info}
                </p>{' '}
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default Notify
