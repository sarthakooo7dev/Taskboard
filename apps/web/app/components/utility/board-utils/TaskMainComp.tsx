'use client'

import TaskRow from './TaskRow'

import {
  BadgeInfo,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  Divide,
  Info,
} from 'lucide-react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import {
  availableStatusType,
  boardMember,
  TaskCacheUpdate,
  TaskItem,
} from '@/app/types/general.types'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import TaskDetailsSheet from './TaskDetailsSheet'
import TaskToolbar from './TaskTollbar'
import { useUserStore } from '@/app/store/user-store'
import InfoToolbar from './InfoToolbar'
import { socket } from '@/app/lib/socket'
import { updateBoardTaskCache } from '@/app/lib/cacheHelpers/updateBoardTaskCache'

const columns = `
    minmax(320px, 2.4fr)
    minmax(140px, 1.2fr)
    minmax(120px, 1fr)
    minmax(90px, 0.8fr)
    minmax(90px, 0.8fr)
    minmax(100px, 0.9fr)
    minmax(10px, 0.9fr)
    minmax(61px, 0.5fr)
`

const TaskMainComp = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const taskIdFromRoute = searchParams.get('taskId')
  const router = useRouter()
  const paramsUrl = new URLSearchParams(searchParams.toString())

  const ITEMS_PER_PAGE: number = 6
  const [currentPage, setCurrentPage] = useState<number>(1)

  const { data, isLoading } = useQuery({
    queryKey: ['board-tasks', params.boardId],
    queryFn: async () => {
      const res = await fetch(`/api/boards/${params.boardId}`)

      if (!res.ok) {
        toast.error('Something went wrong. Try refresh')
        throw new Error('Failed to fetch Tasks for the board')
      }
      return res.json()
    },
    // refetchOnMount: false, // 10 seconds
  })

  const { data: membersData, isLoading: isLoadingMembers } = useQuery({
    queryKey: ['board-members', params.boardId],
    queryFn: async () => {
      const res = await fetch(`/api/boards/${params.boardId}/members`)

      if (!res.ok) {
        toast.error('Something went wrong. Try refresh')
        throw new Error('Failed to fetch Members for the board')
      }
      return res.json()
    },
  })

  const tasks = data?.data?.tasks ?? []

  const [visibleTasks, setVisibleTasks] = useState<TaskItem[]>(tasks)

  const members = membersData?.data ?? []
  const membersList = members.map((val: any) => ({
    id: val.user.id,
    name: val.user.name,
    avatar: val.user.avatar,
    role: val.role,
  }))

  const User = useUserStore((s) => s.user)
  const currentUserMembership = membersList.find(
    (val: boardMember) => val.id === User?.id,
  )

  const availableStatus: availableStatusType[] =
    data?.data?.board?.columns ?? []

  const totalTasks = tasks.length
  const totalPages = Math.ceil(totalTasks / ITEMS_PER_PAGE)

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  const paginatedTasks = visibleTasks.slice(startIndex, endIndex)
  const [openTask, setOpenTask] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const updateTaskListRef = useRef(false)
  const applyFilterRef = useRef<(() => TaskItem[]) | null>(null)

  const pendingUpdatesRef = useRef(new Map<string, TaskCacheUpdate>())
  const [pendingUpdateCount, setPendingUpdateCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSelectedTask = (currentTask: TaskItem, editMode?: boolean) => {
    setSelectedTask(currentTask)
    if (editMode) {
      setIsEditMode(true)
    }
    setOpenTask(true)
  }

  useEffect(() => {
    if (
      (tasks.length > 0 && visibleTasks.length === 0) ||
      updateTaskListRef.current
    ) {
      const filteredTasks = applyFilterRef.current?.()

      if (filteredTasks) {
        setVisibleTasks(filteredTasks)
      }
    }
  }, [tasks])

  useEffect(() => {
    if (!taskIdFromRoute) return
    if (!tasks.length) return

    const task = tasks.find((t: TaskItem) => t.id === taskIdFromRoute)

    if (!task) return

    setSelectedTask(task)
    setOpenTask(true)
    paramsUrl.set('taskId', '')

    router.replace(`?${paramsUrl.toString()}`, {
      scroll: false,
    })
  }, [taskIdFromRoute, tasks])

  const blockedCount: number = tasks.filter(
    (taskVal: TaskItem) => taskVal.column.type === 'BLOCKED',
  ).length

  useEffect(() => {
    if (!User?.id || !params.boardId) return

    socket.emit('JOIN_BOARD', {
      boardId: params.boardId,
      userId: User.id,
    })

    socket.on('task-updated', (data) => {
      if (data.senderId === User.id) return

      pendingUpdatesRef.current.set(data.taskId, data)
      setPendingUpdateCount(pendingUpdatesRef.current.size)
    })

    return () => {
      socket.emit('LEAVE_BOARD')
      socket.off('task-updated')
    }
  }, [User?.id, params.boardId])

  const handleCacheUpdates = (data: TaskCacheUpdate) => {
    console.log(data)
    const updateTaskCache = {
      taskId: data.taskId,
      title: data.title,
      description: data.description,
      columnId: data.columnId,
      progress: data.progress,
      assignedTo: data.assignedTo,
      columnName: data.column.name,
      columnType: data.column.type,
      estimate: data.estimate,
      Priority: data.Priority,
    }
    updateBoardTaskCache(queryClient, data.boardId, updateTaskCache)
    updateTaskListRef.current = true
  }

  const handleSyncUpdates = () => {
    setIsSyncing(true)
    for (const update of pendingUpdatesRef.current.values()) {
      handleCacheUpdates(update)
    }

    pendingUpdatesRef.current.clear()
    setTimeout(() => {
      setPendingUpdateCount(0)
      setIsSyncing(false)
    }, 1400)
  }

  const queryClient = useQueryClient()
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const response = await fetch(
        `/api/boards/${params.boardId}/tasks/${taskId}`,
        {
          method: 'DELETE',
        },
      )

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 403 || response.status === 404) {
          throw new Error(data.message)
        }
        throw new Error('Failed to delete task')
      }

      return data
    },

    onMutate: async (taskId) => {
      const previousTasks = visibleTasks

      setVisibleTasks((prev) => prev.filter((t) => t.id !== taskId))

      return { previousTasks }
    },

    onError: (err, taskId, context) => {
      setVisibleTasks(context!.previousTasks)
      toast.error(`Failed to delete task ( ${err.message})`)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['board-tasks', params.boardId],
      })

      toast.success('Task deleted')
    },
  })

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-md">
      {/* MAIN */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* INFO */}
        <div className="m-1  p-4 ">
          <InfoToolbar
            blockedCount={blockedCount}
            totalTasks={tasks.length}
            pendingUpdateCount={pendingUpdateCount}
            handleSyncUpdates={handleSyncUpdates}
            isSyncing={isSyncing}
          />
        </div>

        {/* TOOLBAR */}
        <div className="mx-1 mb-1  px-4 py-1">
          <TaskToolbar
            availableStatus={availableStatus}
            membersList={membersList}
            tasks={tasks}
            boardId={params?.boardId as string}
            visibleTasks={visibleTasks}
            setVisibleTasks={setVisibleTasks}
            registerApplyFilter={(fn) => {
              applyFilterRef.current = fn
            }}
            updateTaskListRef={updateTaskListRef}
          />
        </div>

        {/* TASK GRID */}
        <div className="mx-1 flex min-h-0 flex-1 flex-col overflow-hidden border-l border-r border-white/[0.04] ">
          {/* HORIZONTAL SCROLL OWNER */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden ">
            {/* WIDTH CONTROLLER */}
            <div className="min-w-[1100px] h-full flex flex-col ">
              {/* HEADER */}
              <div className="sticky top-0 z-20 border-b border-white/[0.04] bg-lg_grey/10 ">
                <div
                  className=" grid h-[34px] items-end   bg-lg_grey/35  text-sm tracking-wider text-gray-300  "
                  style={{ gridTemplateColumns: columns }}
                >
                  <div className=" pl-4 text-left  ">Task</div>

                  <div className="  text-center  ">Status</div>

                  <div className=" text-center ">Progress</div>

                  <div className=" text-center ">Assignee</div>

                  <div className=" text-center ">Estimate</div>

                  <div className=" text-center ">Comments</div>

                  <div className=" text-center ">Priority</div>

                  <div className="text-center  "></div>
                  <div />
                </div>
              </div>

              {/* BODY */}
              <div className="flex-1 overflow-y-auto minimal-scrollbar [scrollbar-gutter:stable]">
                {tasks.length > 0 && visibleTasks.length > 0 ? (
                  <div className="flex flex-col">
                    {paginatedTasks.map((task: TaskItem) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        availableStatus={availableStatus}
                        handleSelectedTask={handleSelectedTask}
                        boardId={params.boardId as string}
                        updateTaskListRef={updateTaskListRef}
                        currentUserMembership={currentUserMembership}
                        onDelete={(taskId) => deleteTaskMutation.mutate(taskId)}
                      />
                    ))}
                  </div>
                ) : isLoading ? (
                  <div className="flex h-full items-center justify-center text-gray-500 ">
                    <Image
                      src="/images/loader.svg"
                      alt="loading"
                      width={30}
                      height={30}
                      priority
                    />
                  </div>
                ) : tasks.length > 0 && visibleTasks.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center">
                    <Info size={26} className="mb-4 text-gray-500" />

                    <h3 className="text-md font-medium text-gray-400 tracking-wider">
                      No matching tasks
                    </h3>

                    <p className="mt-2 text-[13px] text-gray-500 tracking-wide">
                      Try a different search term or remove filters
                    </p>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center gap-1 text-gray-500">
                    <ClipboardList size={22} />
                    <p className="mt-1 text-sm tracking-wider">No tasks yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mx-1 grid grid-cols-3 rounded-b-xl border border-white/[0.04] p-1">
        {/* INFO */}
        <p className="flex items-center pl-2 text-xs text-gray-500">
          {totalTasks > 0
            ? `Showing ${startIndex + 1} to ${Math.min(
                endIndex,
                totalTasks,
              )} of ${totalTasks} tasks`
            : 'No tasks'}
        </p>

        {/* PAGINATION */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1">
            {/* PREV */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="flex items-center justify-center rounded-md p-1 text-gray-500 transition-colors duration-200 hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronsLeft size={18} />
            </button>

            {/* PAGE BUTTONS */}
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1
              const isActive = page === currentPage

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-4 min-w-[20px] items-center justify-center rounded-sm  text-[12px] transition-colors duration-200 text-gray-400 ${
                    isActive ? ' border border-purple-700  ' : ''
                  }`}
                >
                  {page}
                </button>
              )
            })}

            {/* NEXT */}
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="flex items-center justify-center rounded-md p-1 text-gray-500 transition-colors duration-200 hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronsRight size={18} />
            </button>
          </div>
        </div>
        <div />
      </div>

      <TaskDetailsSheet
        key={selectedTask?.id}
        openTask={openTask}
        onOpenChange={setOpenTask}
        task={selectedTask}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        availableStatus={availableStatus}
        boardId={params.boardId as string}
        membersList={membersList}
        updateTaskListRef={updateTaskListRef}
      />
    </div>
  )
}

export default TaskMainComp
