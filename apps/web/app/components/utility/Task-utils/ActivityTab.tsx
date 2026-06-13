import { formatCommentTime } from '@/app/lib/utils/ui/boardHelpers'
import { Activity, ActivityTabProps } from '@/app/types/general.types'
import { useQuery } from '@tanstack/react-query'
import {
  CheckCircle2,
  Loader2,
  MessageSquare,
  MoveRight,
  Pencil,
  StickyNote,
  UserPlus,
} from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const getActivityContent = (activity: Activity) => {
  const actor = activity.actor.name

  switch (activity.type) {
    case 'TASK_MOVED':
      return {
        icon: <MoveRight size={11} className="text-blue-400" />,
        bg_style: 'bg-blue-500/20',
        text: `${actor} moved task to ${activity.metadata.toStatus}`,
      }

    case 'TASK_ASSIGNED':
      return {
        icon: <UserPlus size={11} className="text-green-400" />,
        bg_style: 'bg-green-500/20',
        text: `${actor} assigned task to ${activity.metadata.assignedTo}`,
      }

    case 'COMMENT_CREATED':
      return {
        icon: <MessageSquare size={11} className="text-orange-400" />,
        bg_style: 'bg-orange-500/20',
        text: `${actor} commented`,
      }

    case 'TASK_UPDATED':
      return {
        icon: <Pencil size={11} className="text-amber-400" />,
        bg_style: 'bg-yellow-500/20',
        text: `${actor} updated task details`,
      }

    default:
      return {
        icon: <StickyNote size={11} className="text-gray-300" />,
        bg_style: 'bg-gray-500',
        text: `${actor} performed an action`,
      }
  }
}

const ActivityTab = ({ boardId, taskId, isExpanded }: ActivityTabProps) => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['task-activity', boardId, taskId],
    queryFn: async () => {
      const res = await fetch(`/api/boards/${boardId}/tasks/${taskId}/activity`)

      if (!res.ok) {
        toast.error('Something went wrong loading Activity. Try refresh')
        throw new Error('Failed to fetch activity for the task')
      }
      return res.json()
    },
  })

  const ActivityData = data?.slice(0, 5) ?? []

  return (
    <div className="h-full overflow-y-auto minimal-scrollbar p-1 pl-2 ">
      {isLoading && (
        <div className="h-full flex-1 flex items-center justify-center ">
          <Loader2 size={16} className="animate-spin text-purple-500" />
        </div>
      )}

      {!isLoading && ActivityData?.length === 0 && (
        <div className=" h-full flex flex-1 flex-col items-center justify-center">
          <p className="text-sm text-gray-400">No Activity yet</p>

          <p className="mt-1 text-[12px] text-gray-500">
            Task activity will appear here
          </p>
        </div>
      )}

      {ActivityData.map((val: Activity) => {
        const { icon, text, bg_style } = getActivityContent(val)

        return (
          <div key={val.id} className="flex gap-2 items-center mt-[6px]">
            <div
              className={`mt-0.5 flex h-5 w-6 items-center justify-center rounded-full ${bg_style}`}
            >
              {icon}
            </div>

            <div className="flex-1 flex justify-between items-center ">
              <p className="text-[14px] text-gray-400 tracking-wide ">{text}</p>

              {isExpanded && (
                <p className="mt-1 text-xs text-gray-500 pr-2">
                  {formatCommentTime(val.createdAt)}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ActivityTab
