'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  X,
  Check,
  Bolt,
  Users,
  ArrowUpFromLine,
  RefreshCcw,
  Clock3,
  Calendar,
  Flag,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import {
  AppliedFilters,
  CreateTaskFormData,
  TaskItem,
  TaskPriority,
  TaskToolbarProps,
} from '@/app/types/general.types'
import {
  PRIORITIES,
  priorityStyles,
  statusStyles,
} from '@/app/lib/utils/ui/boardHelpers'
import CreateTaskModal from './CreateTaskModal'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

type FilterType = 'status' | 'priority' | 'assignee'

const TaskToolbar = ({
  availableStatus,
  membersList,
  tasks,
  visibleTasks,
  setVisibleTasks,
  registerApplyFilter,
  boardId,
  updateTaskListRef,
}: TaskToolbarProps) => {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('Updated')
  const [activeFilter, setActiveFilter] = useState<FilterType>('status')

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortOpen, setIsSortOpen] = useState(false)
  const [openTaskModal, setOpenTaskModal] = useState(false)
  const [isTaskPending, setIsTaskPending] = useState(false)
  const queryClient = useQueryClient()
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    statuses: [],
    priorities: [],
    members: [],
  })
  const appliedFiltersCount =
    appliedFilters.statuses.length +
    appliedFilters.priorities.length +
    appliedFilters.members.length

  const SORT_OPTIONS = [
    {
      label: 'Updated',
      value: 'updated',
      icon: Clock3,
    },
    {
      label: 'Created',
      value: 'created',
      icon: Calendar,
    },
    {
      label: 'Priority',
      value: 'priority',
      icon: Flag,
    },
  ] as const

  const priorityOrder = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  }

  const toggleStatus = (id: string) =>
    setSelectedStatuses((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const toggleMember = (id: string) =>
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const togglePriority = (priority: string) =>
    setSelectedPriorities((prev) =>
      prev.includes(priority)
        ? prev.filter((x) => x !== priority)
        : [...prev, priority],
    )

  const clearFilters = () => {
    setSelectedStatuses([])
    setSelectedMembers([])
    setSelectedPriorities([])
    setVisibleTasks(tasks)
    setAppliedFilters({
      statuses: [],
      priorities: [],
      members: [],
    })
    setIsFilterOpen(false)
  }

  const getFilteredTasks = (searchText: string) => {
    const filtered = tasks.filter((task) => {
      const matchesSearch =
        searchText === '' ||
        task.title.toLowerCase().includes(searchText.toLowerCase())

      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(task.column.id)

      const matchesPriority =
        selectedPriorities.length === 0 ||
        selectedPriorities.includes(task.Priority)

      const matchesAssignee =
        selectedMembers.length === 0 ||
        selectedMembers.includes(task.assignedTo.id)
      return (
        matchesSearch && matchesStatus && matchesPriority && matchesAssignee
      )
    })

    return filtered
  }

  const ApplyFilters = () => {
    const filteredTasks = getFilteredTasks('')
    setAppliedFilters({
      statuses: [...selectedStatuses],
      priorities: [...selectedPriorities],
      members: [...selectedMembers],
    })
    return filteredTasks
  }

  useEffect(() => {
    registerApplyFilter(ApplyFilters)
  }, [selectedStatuses, selectedPriorities, selectedMembers, tasks])

  const handleApplyFilter = () => {
    setSearch('')
    const FilteredTaskList = ApplyFilters()
    setVisibleTasks(FilteredTaskList)

    setIsFilterOpen(false)
  }

  const renderFilterContent = () => {
    switch (activeFilter) {
      case 'status':
        return (
          <div className="space-y-1">
            {availableStatus.map((status) => (
              <button
                key={status.id}
                onClick={() => toggleStatus(status.id)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-lg_grey/20 text-gray-200 tracking-wider"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    statusStyles[status.type].dot
                  }`}
                />
                <span>{status.name}</span>
                {selectedStatuses.includes(status.id) && <Check size={14} />}
              </button>
            ))}
          </div>
        )

      case 'priority':
        return (
          <div className="space-y-2">
            {PRIORITIES.map((priority) => (
              <div
                key={priority}
                className=" flex items-center justify-between hover:cursor-pointer hover:bg-lg_grey/30"
                onClick={() => togglePriority(priority)}
              >
                <button
                  className={`flex items-center justify-between rounded-md px-3 py-0.5 text-xs tracking-wider ${priorityStyles[priority]}`}
                >
                  {priority}
                </button>
                <span>
                  {selectedPriorities.includes(priority) && <Check size={14} />}
                </span>
              </div>
            ))}
          </div>
        )

      case 'assignee':
        return (
          <div className="space-y-1 max-h-[260px] overflow-y-auto">
            {membersList.map((member) => (
              <button
                key={member.id}
                onClick={() => toggleMember(member.id)}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-lg_grey/30"
              >
                <div className="flex items-center gap-2 text-gray-300 tracking-wide">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-6 w-6 rounded-full"
                  />
                  <span>{member.name}</span>
                </div>

                {selectedMembers.includes(member.id) && <Check size={14} />}
              </button>
            ))}
          </div>
        )
    }
  }

  const handleSearch = (value: string) => {
    let filteredTasks: TaskItem[]
    setSearch(value)

    if (value.length == 0) {
      filteredTasks = getFilteredTasks('')
    } else {
      filteredTasks = visibleTasks.filter((task) =>
        task.title.toLowerCase().includes(value.toLowerCase()),
      )
    }

    setVisibleTasks(filteredTasks)
  }

  const selectedSort =
    SORT_OPTIONS.find((s) => s.value === sortBy) ?? SORT_OPTIONS[0]

  const handleSort = (sortType: string) => {
    setSortBy(sortType)
    let sortedTasks = [...visibleTasks]
    switch (sortType) {
      case 'updated':
        sortedTasks.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        break

      case 'created':
        sortedTasks.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        break

      case 'priority':
        sortedTasks.sort(
          (a, b) => priorityOrder[b.Priority] - priorityOrder[a.Priority],
        )
        break
    }

    setVisibleTasks(sortedTasks)
    setIsSortOpen(false)
  }
  const handleCreateTask = async (data: CreateTaskFormData) => {
    try {
      setIsTaskPending(true)

      const response = await fetch(`/api/boards/${boardId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          Priority: data.priority,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      const createdTask = await response.json()
      queryClient.invalidateQueries({
        queryKey: ['board-tasks', boardId],
      })

      updateTaskListRef.current = true
      setIsTaskPending(false)
      setOpenTaskModal(false)

      toast.success('Task created !')
    } catch (error) {
      toast.error('Something went wrong while creating task.Try again')
      setIsTaskPending(false)
      console.error(error)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search tasks..."
            className="pl-9 text-gray-300 tracking-wider"
          />
          {search.length > 0 && (
            <X
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={(e) => handleSearch('')}
            />
          )}
        </div>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 text-gray-300 tracking-wide rounded-md hover:bg-transparent hover:text-gray-300 "
            >
              <Filter size={14} />
              Filter{' '}
              {appliedFiltersCount > 0 && (
                <span className=" text-purple-500">
                  {' '}
                  ({appliedFiltersCount}){' '}
                </span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent align="end" className="w-[500px] p-0 bg-dk_grey">
            <div className="flex h-[200px]">
              <div className="w-40 border-r">
                <button
                  onClick={() => setActiveFilter('status')}
                  className={`flex items-center gap-2 tracking-wider text-gray-300 w-full px-4 py-3 text-left text-sm ${
                    activeFilter === 'status' ? 'bg-lg_grey/30' : ''
                  }`}
                >
                  <Bolt size={16} className="text-purple-600" /> Status
                </button>

                <button
                  onClick={() => setActiveFilter('priority')}
                  className={`flex items-center gap-2 tracking-wider text-gray-300  w-full px-4 py-3 text-left text-sm ${
                    activeFilter === 'priority' ? 'bg-lg_grey/30' : ''
                  }`}
                >
                  <ArrowUpFromLine size={16} className="text-orange-600" />{' '}
                  Priority
                </button>

                <button
                  onClick={() => setActiveFilter('assignee')}
                  className={`flex items-center gap-2 tracking-wider text-gray-300  w-full px-4 py-3 text-left text-sm ${
                    activeFilter === 'assignee' ? 'bg-lg_grey/30' : ''
                  }`}
                >
                  <Users size={16} className="text-blue-600" /> Assignee
                </button>
              </div>

              <div className="flex-1 p-3">{renderFilterContent()}</div>
            </div>

            <div className="flex justify-end border-t p-2 gap-3">
              <Button
                variant="ghost"
                className="h-8 rounded-md px-3 text-sm text-gray-300 tracking-wider hover:bg-white/5 hover:text-gray-200"
                onClick={clearFilters}
              >
                Reset
              </Button>
              <Button
                variant="ghost"
                className="h-8  rounded-md  px-3 text-sm tracking-widest text-gray-100 bg-purple-600/70 hover:text-gray-200"
                onClick={handleApplyFilter}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={sortOpen} onOpenChange={setIsSortOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 text-gray-300 tracking-wider rounded-md hover:bg-transparent hover:text-gray-300"
            >
              <ArrowUpDown size={14} />
              Sort : {selectedSort.label}
            </Button>
          </PopoverTrigger>

          <PopoverContent align="end" className="w-[12rem] p-2 bg-dk_grey">
            {SORT_OPTIONS.map((option) => {
              const Icon = option.icon

              return (
                <button
                  key={option.value}
                  onClick={() => handleSort(option.value)}
                  className={`flex items-center gap-2 w-full rounded-md px-3 py-2 text-left text-gray-300 tracking-wider text-sm hover:bg-white/5 ${
                    sortBy === option.value ? 'bg-muted' : ''
                  }`}
                >
                  <Icon size={14} />
                  {option.label}
                </button>
              )
            })}
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          className="gap-2 bg-purple-500/60 text-gray-100 tracking-wider"
          onClick={() => setOpenTaskModal(true)}
        >
          <Plus size={17} />
          Add Task
        </Button>
      </div>

      {appliedFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {appliedFilters.statuses.map((id) => {
            const status = availableStatus.find((s) => s.id === id)

            return (
              <div
                key={id}
                className="flex items-center gap-2 rounded-full border border-purple-900 px-3 py-1 text-xs text-gray-300 tracking-wider"
              >
                {status?.name}
              </div>
            )
          })}

          {appliedFilters.priorities.map((priority) => (
            <div
              key={priority}
              className="flex items-center gap-2 rounded-full border border-purple-900 px-3 py-1 text-xs text-gray-300 tracking-wider"
            >
              {priority}
            </div>
          ))}

          {appliedFilters.members.map((id) => {
            const member = membersList.find((m) => m.id === id)

            return (
              <div
                key={id}
                className="flex items-center gap-2 rounded-full border border-purple-900 px-3 py-1 text-xs text-gray-300 tracking-wider"
              >
                {member?.name}
              </div>
            )
          })}

          <div
            className="flex items-center gap-2 rounded-full  px-3 py-1 text-xs text-gray-300 tracking-widest cursor-pointer hover:text-gray-200 hover:bg-lg_grey/70"
            onClick={clearFilters}
          >
            <RefreshCcw size={13} /> Reset
          </div>
        </div>
      )}

      <CreateTaskModal
        open={openTaskModal}
        onOpenChange={setOpenTaskModal}
        availableStatus={availableStatus}
        membersList={membersList}
        onSubmit={handleCreateTask}
        isPending={isTaskPending}
      />
    </div>
  )
}

export default TaskToolbar
