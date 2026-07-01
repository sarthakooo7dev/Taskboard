import { QueryClient } from '@tanstack/react-query'

export function updateBoardTaskCache(
  queryClient: QueryClient,
  boardId: string,
  updatedTask: any,
) {
  queryClient.setQueryData(['board-tasks', boardId], (oldData: any) => {
    // Safety check
    if (!oldData) return oldData
    return {
      ...oldData,
      data: {
        ...oldData.data,
        tasks: oldData.data.tasks.map((task: any) => {
          console.log('zzzzzzzzzz TASK', task.id)
          if (task.id === updatedTask.taskId) {
            console.log('FOUND TASK', task.id)
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
}
