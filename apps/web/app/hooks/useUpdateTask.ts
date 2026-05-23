'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { boardMember, TaskItem, TaskStatus } from '../types/general.types'
import { BoardMember, PriorityType } from '@repo/db'

type UpdateTaskParams = {
  taskId: string
  title?: string
  description?: string
  columnId?: string
  progress?: number
  assignedTo?: boardMember
  columnName?: string
  columnType?: TaskStatus
  estimate?: number
  Priority?: PriorityType
}

type UseUpdateTaskProps = {
  boardId: string
}

export const useUpdateTask = ({ boardId }: UseUpdateTaskProps) => {
  const queryClient = useQueryClient()

  return useMutation({
    // Async API request
    mutationFn: async ({
      taskId,
      title,
      description,
      Priority,
      columnId,
      estimate,
      progress,
      assignedTo,
    }: UpdateTaskParams) => {
      const res = await fetch(`/api/boards/${boardId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(Priority !== undefined && { Priority }),
          ...(columnId !== undefined && { columnId }),
          ...(estimate !== undefined && { estimate }),
          ...(progress !== undefined && { progress }),
          ...(assignedTo?.id !== undefined && { assignedToId: assignedTo?.id }),
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to update task')
      }

      return res.json()
    },

    // OPTIMISTIC UPDATE
    onMutate: async (updatedTask) => {
      // Stop ongoing task fetches
      await queryClient.cancelQueries({
        queryKey: ['board-tasks', boardId],
      })

      // Save previous cache for rollback
      const previousTasks = queryClient.getQueryData(['board-tasks', boardId])

      // Immediately update cache
      queryClient.setQueryData(['board-tasks', boardId], (oldData: any) => {
        // Safety check
        if (!oldData) return oldData
        return {
          ...oldData,
          data: {
            ...oldData.data,
            tasks: oldData.data.tasks.map((task: any) => {
              if (task.id === updatedTask.taskId) {
                return {
                  ...task,
                  ...(updatedTask.title !== undefined && {
                    title: updatedTask.title,
                  }),
                  ...(updatedTask.description !== undefined && {
                    description: updatedTask.description,
                  }),
                  ...(updatedTask.Priority !== undefined && {
                    Priority: updatedTask.Priority,
                  }),
                  ...(updatedTask.columnId !== undefined && {
                    columnId: updatedTask.columnId,
                    column: {
                      ...task.column,
                      id: updatedTask.columnId,
                      name: updatedTask.columnName,
                      type: updatedTask.columnType,
                    },
                  }),
                  ...(updatedTask.estimate !== undefined && {
                    estimate: updatedTask.estimate,
                  }),
                  ...(updatedTask.progress !== undefined && {
                    progress: updatedTask.progress,
                  }),
                  ...(updatedTask.assignedTo !== undefined && {
                    assignedTo: updatedTask.assignedTo,
                  }),
                }
              }
              return task
            }),
          },
        }
      })
      return {
        previousTasks,
      }
    },

    // If request fails restore previous cache
    onError: (err, variables, context) => {
      queryClient.setQueryData(['board-tasks', boardId], context?.previousTasks)

      toast.error('Failed to update task')

      // console.log(
      //   'onerror ____ ' +
      //     JSON.stringify(queryClient.getQueryData(['board-tasks', boardId])),
      // )
    },

    // Request succeeded
    onSuccess: () => {
      // Silent background sync
      // queryClient.invalidateQueries({ queryKey: ['board-tasks', boardId] })
      // console.log(
      //   'onSuccess ____ ' +
      //     JSON.stringify(queryClient.getQueryData(['board-tasks', boardId])),
      // )
    },
  })
}
