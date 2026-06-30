'use client'

import React, { useEffect, useState } from 'react'
import { Bell, BellRing, ClockArrowDown, Info, Sprout } from 'lucide-react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { useUserStore } from '@/app/store/user-store'
import { socket } from '@/app/lib/socket'
import { formatNotification } from '@/app/lib/utils/ui/notificationFormatter'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Notification } from '@/app/types/notification.types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  formatCommentTime,
  formatTimeAgo,
} from '@/app/lib/utils/ui/boardHelpers'

const Notify = () => {
  const [notifications, setNotifications] = useState<any[]>([])
  const count = notifications.length
  const { user } = useUserStore()
  const [isRinging, setIsRinging] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await fetch('/api/notifications')

      if (!res.ok) {
        throw new Error('Failed to fetch activity data')
      }

      return res.json()
    },

    staleTime: 10 * 1000,
  })

  const allNotifyData: Notification[] = data?.data ?? []
  const unreadNotifyData: Notification[] = allNotifyData.filter(
    (val) => !val.read,
  )

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load notifications. Please try refreshing again.')
    }
  }, [isError])

  useEffect(() => {
    if (!user?.id) return
    socket.emit('REGISTER', {
      userId: user?.id,
    })

    socket.on('notification', (notification) => {
      queryClient.setQueryData(['notifications'], (old: any) => ({
        ...old,
        data: [notification, ...(old?.data ?? [])],
      }))

      setIsRinging(true)
      setTimeout(() => {
        setIsRinging(false)
      }, 900)
    })

    return () => {
      socket.off('notification')
    }
  }, [user?.id])

  const handleNav = (
    taskId: string,
    boardTitle: string,
    boardId: string,
    notifyID: string,
  ) => {
    // Optimistically marked as read
    queryClient.setQueryData(['notifications'], (old: any) => {
      if (!old) return old
      return {
        ...old,
        data: old.data.map((n: Notification) =>
          n.id === notifyID ? { ...n, read: true } : n,
        ),
      }
    })

    fetch(`/api/notifications/${notifyID}`, { method: 'PATCH' }).catch(() => {
      // Optional rollback
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      })
    })

    // router.push(
    //   `/dashboard/boards/${boardId}?title=${encodeURIComponent(
    //     boardTitle,
    //   )}&taskId=${taskId}`,
    // )
  }

  const handleReadAll = () => {
    // Optimistically marked all  read
    queryClient.setQueryData(['notifications'], (old: any) => {
      if (!old) return old
      return {
        ...old,
        data: old.data.map((n: Notification) => ({ ...n, read: true })),
      }
    })

    fetch(`/api/notifications/read-all`, { method: 'PATCH' }).catch(() => {
      // Optional rollback
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      })
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative px-3 h-8 rounded-md bg-dk_grey border border-[rgb(50,49,54)]
                     hover:bg-lg_grey transition flex items-center justify-center"
          aria-label="Notifications"
        >
          <Bell size={16} className={isRinging ? 'animate-bell ' : ''} />

          {/* 🔵 Badge */}
          {unreadNotifyData.length > 0 && (
            <span
              className={` absolute top-1 right-1.5 h-1 w-1 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.45)]
                     `}
            />
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
        <div className="px-3 py-2 border-b border-dk_border text-sm font-medium text-gray-400 flex items-center justify-between gap-2 ">
          <span className="flex items-center gap-2 tracking-wider">
            <Bell size={14} className="rotate-[-45deg]" /> Notifications{' '}
          </span>
          <span
            className="text-xs text-purple-600 cursor-pointer tracking-wide"
            onClick={handleReadAll}
          >
            Read all
          </span>
        </div>

        {/* Body */}
        <div className="h-72  mt-[-7px]">
          <Tabs defaultValue="All" className="flex h-full min-h-0 flex-col  ">
            <TabsList className="text-gray-400 tracking-wider px-2 py-0 ">
              <TabsTrigger
                value="All"
                className="rounded-sm  border-b border-transparent data-[state=active]:border-b-purple-700"
              >
                All
                <span className="text-[11px] tracking-wider">
                  ({allNotifyData.length})
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="Unread"
                className="rounded-sm  border-b border-transparent data-[state=active]:border-b-purple-700"
              >
                unread
                <span className="text-[11px] tracking-wider">
                  ({unreadNotifyData.length})
                </span>
              </TabsTrigger>
            </TabsList>

            {isLoading ? (
              <div>loading....</div>
            ) : (
              <>
                <TabsContent
                  value="All"
                  className=" flex-1 min-h-0 overflow-y-auto minimal-scrollbar [scrollbar-gutter:stable] rounded-md  "
                >
                  {allNotifyData.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <Info
                          size={18}
                          className="mx-auto mb-2 text-gray-500"
                        />
                        <p className="text-xs text-gray-500 tracking-wider">
                          No new Notifications
                        </p>
                      </div>
                    </div>
                  ) : (
                    allNotifyData.map((notify) => {
                      const item = formatNotification(notify, user?.id ?? '')
                      const Icon = item.icon
                      return (
                        <div
                          key={notify.id}
                          className="p-1 text-gray-400 text-[12px] "
                        >
                          {' '}
                          <div
                            className=" flex items-start gap-2 p-1  hover:bg-lg_grey/30 cursor-pointer"
                            onClick={() =>
                              handleNav(
                                item.entityId,
                                item.boardTitle,
                                item.boardId,
                                notify.id,
                              )
                            }
                          >
                            <span className={`p-2 ${item.bg_style} rounded-md`}>
                              <Icon size={16} className={`${item.txt_style}`} />
                            </span>{' '}
                            <div className="">
                              <span className="text-gray-400">
                                {' '}
                                {item.info}
                              </span>
                              <div className="flex items-center justify-between text-[10px] gap-2  ">
                                <span>
                                  {item.boardTitle} . {formatTimeAgo(item.time)}{' '}
                                </span>
                                <span
                                  className={`${
                                    !item.read
                                      ? 'text-purple-600'
                                      : 'text-gray-600'
                                  }`}
                                >
                                  ●{' '}
                                </span>
                              </div>
                            </div>
                          </div>{' '}
                        </div>
                      )
                    })
                  )}
                </TabsContent>

                <TabsContent
                  value="Unread"
                  className="flex-1 min-h-0 overflow-y-auto minimal-scrollbar  [scrollbar-gutter:stable] rounded-md "
                >
                  {unreadNotifyData.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <Info
                          size={18}
                          className="mx-auto mb-2 text-gray-500"
                        />

                        <p className="text-xs text-gray-500 tracking-wider">
                          No unread notifications
                        </p>
                      </div>
                    </div>
                  ) : (
                    unreadNotifyData.map((notify) => {
                      const item = formatNotification(notify, user?.id ?? '')
                      const Icon = item.icon
                      return (
                        <div
                          key={notify.id}
                          className="p-1 text-gray-400 text-[12px] "
                        >
                          {' '}
                          <div
                            className=" flex items-start gap-2 p-1  hover:bg-lg_grey/30 cursor-pointer"
                            onClick={() =>
                              handleNav(
                                item.entityId,
                                item.boardTitle,
                                item.boardId,
                                notify.id,
                              )
                            }
                          >
                            <span className={`p-2 ${item.bg_style} rounded-md`}>
                              <Icon size={16} className={`${item.txt_style}`} />
                            </span>{' '}
                            <div className="">
                              <span className="text-gray-400">
                                {' '}
                                {item.info}
                              </span>
                              <div className="flex items-center justify-between text-[10px] gap-2 ">
                                <span>
                                  {item.boardTitle} . {formatTimeAgo(item.time)}{' '}
                                </span>
                                <span
                                  className={`${
                                    !item.read
                                      ? 'text-purple-600'
                                      : 'text-gray-600'
                                  }`}
                                >
                                  ●{' '}
                                </span>
                              </div>
                            </div>
                          </div>{' '}
                        </div>
                      )
                    })
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default Notify
