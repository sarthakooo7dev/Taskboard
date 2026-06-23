'use client'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { ActivityIcon, Layers2, RefreshCcw } from 'lucide-react'
import { ActivityData, TaskStatus } from '@/app/types/general.types'
import { formatTimeAgo, statusStyles } from '@/app/lib/utils/ui/boardHelpers'
import { useUserStore } from '@/app/store/user-store'
import { toast } from 'sonner'
import { useEffect } from 'react'

const ActivityFeed = () => {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/activity')

      if (!res.ok) {
        throw new Error('Failed to fetch activity data')
      }

      return res.json()
    },

    staleTime: 10 * 1000,
  })

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load activity. Please try refreshing again.')
    }
  }, [isError])

  const activityData: ActivityData[] = data?.data ?? []

  const visibleActivityData = activityData.slice(0, 4)
  const userID = useUserStore((s) => s.user)?.id

  const truncateName = (name: string, max = 15) =>
    name.length > max ? `${name.slice(0, max)}...` : name

  const getActivityContent = (activity: ActivityData) => {
    const modifiedBy =
      activity.actor.id === userID ? 'You' : `${activity.metadata.modifiedBy}`
    switch (activity.type) {
      case 'TASK_CREATED':
        return {
          action: 'created task',
          info: (
            <p className="tracking-wide line-clamp-2 text-[13px] leading-5 text-gray-400">
              <span className="text-gray-300">{truncateName(modifiedBy)}</span>{' '}
              created a task{' '}
              <span className="text-purple-400 text-[11px]">
                {activity.metadata.title}
              </span>
            </p>
          ),
        }

      case 'TASK_MOVED':
        return {
          action: 'moved task',
          info: (
            <p className="tracking-wide line-clamp-2 text-[13px] leading-5 text-gray-400">
              <span className="text-gray-400">{truncateName(modifiedBy)}</span>{' '}
              <span className="">moved '{activity.metadata.title}' to </span>
              <span
                className={`tracking-wider text-[11px] ${
                  statusStyles[activity.metadata.toStatus as TaskStatus]?.text
                }`}
              >
                {statusStyles[activity.metadata.toStatus as TaskStatus]?.label}
              </span>{' '}
            </p>
          ),
        }

      case 'TASK_UPDATED':
        return {
          action: 'updated task',
          info: (
            <p className="tracking-wide line-clamp-2 text-[13px] leading-5 text-gray-400">
              <span className="text-gray-300">{truncateName(modifiedBy)}</span>{' '}
              updated task{' '}
              <span className="text-purple-400 text-[11px]">
                {activity.metadata.title}
              </span>
            </p>
          ),
        }

      case 'TASK_DELETED':
        return {
          action: 'deleted task',
          info: (
            <p className="tracking-wide line-clamp-2 text-[13px] leading-5 text-gray-400">
              <span className="text-gray-300">{truncateName(modifiedBy)}</span>{' '}
              deleted a task
            </p>
          ),
        }

      case 'TASK_ASSIGNED':
        return {
          action: 'assigned task',
          info: (
            <p className="tracking-wide line-clamp-2 text-[13px] leading-5 text-gray-400">
              <span className="text-gray-300">{truncateName(modifiedBy)}</span>{' '}
              assigned task to{' '}
              <span className="text-purple-400 text-[11px]">
                {truncateName(activity.metadata.assignedTo ?? '')}
              </span>
            </p>
          ),
        }

      case 'COMMENT_CREATED':
        return {
          action: 'commented',
          info: (
            <p className="tracking-wide line-clamp-2 text-[13px] leading-5 text-gray-400">
              <span className="text-gray-300">{truncateName(modifiedBy)}</span>{' '}
              added a comment on task{' '}
              <span className="text-purple-400 text-[11px]">
                {activity.metadata.commentedOn}
              </span>
            </p>
          ),
        }

      default:
        return {
          action: activity.type,
          info: (
            <p className="tracking-wide line-clamp-2 text-[13px] leading-5 text-gray-400">
              <span className="text-gray-300">{truncateName(modifiedBy)}</span>{' '}
              performed an action
            </p>
          ),
        }
    }
  }

  return (
    <div className="flex h-full flex-col min-h-0 ">
      {/* Header */}
      <div className=" p-2  flex items-center justify-between gap-2  text-gray-300/90  ">
        <div className="flex items-center gap-2">
          <ActivityIcon size={18} className="text-purple-400" />
          <h3 className="text-sm font-medium tracking-wider ">Acitivty Feed</h3>
        </div>
        {isFetching ? (
          <div className="flex items-center gap-1 text-[11px] tracking-wider text-gray-400">
            <RefreshCcw className="h-3 w-3 animate-spin" />
            Syncing
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[10px] tracking-wide text-gray-400">
            <Layers2 size={10} />
            Latest activity
          </div>
        )}
      </div>

      {/* Body */}
      <div className="relative flex-1 overflow-hidden p-3 ">
        {isLoading ? (
          <div className="h-full flex flex-col gap-5 ">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex-1 flex gap-3">
                <div className="relative z-10 h-8 w-8 animate-pulse rounded-full bg-white/5" />

                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 animate-pulse rounded bg-white/5" />
                  <div className="h-3 w-24 animate-pulse rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Timeline */}
            <div className="absolute left-[24px] top-[18px] bottom-[18px] w-px bg-white/10">
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full border-2 border-white/20" />
            </div>

            <div className="h-full grid grid-rows-4 pt-1 ">
              {visibleActivityData.map((activity) => {
                const { action, info } = getActivityContent(activity)

                return (
                  <div
                    key={activity.id}
                    className="relative  flex gap-3  pb-3 "
                  >
                    {/* Avatar + Timeline Dot */}
                    <div className="relative z-10 pl-[0px]">
                      <Image
                        src={activity.actor.avatar || '/avatars/avatar1.png'}
                        alt={activity.actor.name}
                        width={25}
                        height={25}
                        className="rounded-full border"
                      />
                    </div>

                    {/* Content */}
                    <div className=" flex-1 flex justify-between ">
                      {info}

                      <div className="flex flex-col-reverse shrink-0 justify-end  items-end pl-1">
                        <span className=" mt-[1px] truncate rounded-md bg-violet-500/10 px-2 py-[1px] text-[10px] tracking-wider text-violet-300">
                          {activity.board.name}
                        </span>

                        <span className=" text-[11px] text-gray-500">
                          {formatTimeAgo(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ActivityFeed
