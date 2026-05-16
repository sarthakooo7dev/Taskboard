'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { TaskItem } from '../types/general.types'

type UpdateTaskParams = {
  taskId: string
  title?: string
  description?: string
  columnId?: string
  progress?: number
  assignedToId?: string
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
      columnId,
      progress,
      assignedToId,
    }: UpdateTaskParams) => {
      const res = await fetch(`/api/boards/${boardId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(columnId !== undefined && { columnId }),
          ...(progress !== undefined && { progress }),
          ...(assignedToId !== undefined && { assignedToId }),
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
                  ...(updatedTask.columnId !== undefined && {
                    columnId: updatedTask.columnId,
                    column: { ...task.column, id: updatedTask.columnId },
                  }),
                  ...(updatedTask.progress !== undefined && {
                    progress: updatedTask.progress,
                  }),
                  ...(updatedTask.assignedToId !== undefined && {
                    assignedToId: updatedTask.assignedToId,
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

      console.log(
        'onerror ____ ' +
          JSON.stringify(queryClient.getQueryData(['board-tasks', boardId])),
      )
    },

    // Request succeeded
    onSuccess: () => {
      // Silent background sync
      // queryClient.invalidateQueries({ queryKey: ['board-tasks', boardId] })

      console.log(
        'onSuccess ____ ' +
          JSON.stringify(queryClient.getQueryData(['board-tasks', boardId])),
      )
    },
  })
}
