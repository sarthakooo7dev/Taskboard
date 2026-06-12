'use client'

import {
  calculateProgress,
  formatEstimate,
  formatTaskDate,
  parseEstimateToMinutes,
  priorityStyles,
  priorityTextStyles,
  statusStyles,
} from '@/app/lib/utils/ui/boardHelpers'
import {
  availableStatusType,
  boardMember,
  TaskDetailsSheetProps,
  TaskItem,
  TaskStatus,
} from '@/app/types/general.types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  ArrowRightFromLine,
  CalendarClock,
  CalendarPlus,
  Check,
  Clock,
  Divide,
  Dot,
  FileText,
  FoldHorizontal,
  Loader,
  Loader2,
  Maximize2,
  Minus,
  Pencil,
  Plus,
  User2,
  X,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import { title } from 'process'
import { useEffect, useState } from 'react'
import TaskTabs from '../Task-utils/TaskTabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ifError } from 'assert'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { toast } from 'sonner'
import { useUpdateTask } from '@/app/hooks/useUpdateTask'
import { PriorityType } from '@repo/db'
import { parseAppSegmentConfig } from 'next/dist/build/segment-config/app/app-segment-config'

const TaskDetailsSheet = ({
  openTask,
  onOpenChange,
  task,
  isEditMode,
  setIsEditMode,
  availableStatus,
  boardId,
  membersList,
  updateTaskListRef,
}: TaskDetailsSheetProps) => {
  if (!task) return

  const [isExpanded, setIsExPanded] = useState<boolean>(false)

  // manage edited values
  const [titleValue, setTitleValue] = useState<string>(task?.title ?? '')
  const [priority, setPriority] = useState<PriorityType>(task.Priority)
  const [status, setStatus] = useState<availableStatusType>(task?.column)
  const [estimateInput, setEstimateInput] = useState<string>(
    formatEstimate(task.estimate),
  )
  const [estimateValue, setEstimateValue] = useState<number>(task.estimate)
  const [progress, setProgress] = useState<number>(task?.progress ?? 0)
  const [assignee, setAssignee] = useState<boardMember | undefined>(
    task?.assignedTo,
  )
  const [descValue, setDescValue] = useState<string>(task.description)

  // To control editing status
  const [isTitleEdit, setIsTitleEdit] = useState<boolean>(false)
  const [isStatusEdit, setIsStatusEdit] = useState<boolean>(false)
  const [isEstimateEdit, setIsEstimateEdit] = useState<boolean>(false)
  const [isprogressEdit, setIsProgressEdit] = useState<boolean>(false)
  const [isAssigneeEdit, setIsAssigneeEdit] = useState<boolean>(false)
  const [isDescEdit, setIsDescEdit] = useState<boolean>(false)

  const updateTaskMutation = useUpdateTask({ boardId })

  useEffect(() => {
    if (openTask) {
      restoreOldValues()
    }
  }, [openTask])

  const handleStatusChange = (selectedStatusId: string) => {
    const selectedColumn = availableStatus.find(
      (status) => status.id === selectedStatusId,
    )
    if (!selectedColumn || !task?.Priority) return
    let updatedProgress = calculateProgress(selectedColumn, task?.progress)
    setProgress(updatedProgress)
    setStatus(selectedColumn)
  }

  const handleEstimateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = parseEstimateToMinutes(e.target.value)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    setEstimateValue(result.minutes)
  }

  const closeEditMode = () => {
    setIsEditMode(false)
    setIsTitleEdit(false)
    setIsStatusEdit(false)
    setIsEstimateEdit(false)
    setIsProgressEdit(false)
    setIsAssigneeEdit(false)
    setIsDescEdit(false)
  }

  const restoreOldValues = () => {
    setTitleValue(task.title)
    setPriority(task.Priority)
    setStatus(task.column)
    setEstimateValue(task.estimate)
    setEstimateInput(formatEstimate(task.estimate))
    setProgress(task.progress)
    setDescValue(task.description)
    setAssignee(task.assignedTo)
  }

  const enableEditMode = () => {
    setIsEditMode(true)
  }

  const handleCancel = () => {
    closeEditMode()
    restoreOldValues()
  }

  const handleSave = () => {
    updateTaskMutation.mutate(
      {
        taskId: task.id,
        title: titleValue,
        description: descValue,
        Priority: priority,
        columnId: status.id,
        columnName: status.name,
        columnType: status.type,
        estimate: estimateValue,
        progress: progress,
        assignedTo: assignee,
      },
      {
        onSuccess: () => {
          closeEditMode()
        },
      },
    )
    updateTaskListRef.current = true
  }

  return (
    <Sheet open={openTask} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={`w-full border-l border-white/[0.06] bg-dk_grey p-0
                     text-gray-400 transition-all duration-300 ease-in-out ${
                       isExpanded ? 'sm:!max-w-[60%]' : 'sm:!max-w-[30%]'
                     }`}
      >
        <div className="flex h-full flex-col">
          {/* HEADER */}
          <SheetHeader className="border-b border-white/[0.06] px-3 py-4 ">
            <SheetTitle className="text-left  w-[94%] tracking-wider flex justify-between items-center">
              {isExpanded ? (
                <div
                  className="text-[12px] flex items-center  gap-2 w-[5rem] text-gray-300 hover:text-gray-200
                                             cursor-pointer "
                  onClick={() => setIsExPanded(false)}
                >
                  <ArrowRightFromLine size={12} /> Restore
                </div>
              ) : (
                <div
                  className="text-[12px] flex items-center  gap-2 w-[5rem] text-gray-300 hover:text-gray-200
                                             cursor-pointer "
                  onClick={() => setIsExPanded(true)}
                >
                  <Maximize2 size={12} /> Expand
                </div>
              )}

              {isEditMode && (
                <div className="text-xs tracking-widest pr-2 flex items-center text-purple-500">
                  <span className=" h-2 w-2 bg-purple-700 rounded-xl mr-2"></span>{' '}
                  Editing
                </div>
              )}
            </SheetTitle>
          </SheetHeader>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto px-2 pt-1 ">
            <div className=" h-full  flex flex-col  ">
              {/* # title container */}
              <div className="  flex flex-col items-start">
                <div className="w-full tracking-wider text-sm  flex items-center justify-between  text-gray-500 gap-1 ">
                  <div className="flex items-center gap-1  ">
                    <Zap size={13} className="text-purple-400" />
                    <p>Task</p>
                  </div>
                  <div
                    className=" pr-2 flex items-center gap-1 text-gray-400 tracking-widest text-[0.8rem] cursor-pointer hover:text-gray-300"
                    onClick={enableEditMode}
                  >
                    {!isEditMode && (
                      <>
                        <Pencil size={12} />
                        <p>Edit</p>
                      </>
                    )}
                  </div>
                </div>
                {isTitleEdit ? (
                  <textarea
                    className="ml-1 p-1 w-full bg-transparent text-[1rem] tracking-wider font-semibold  mt-1 text-gray-300 max-w-[90%] border border-purple-900 outline-none focus:outline-none focus:ring-0"
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                  />
                ) : (
                  <div className="flex justify-between  w-[90%]">
                    <h1 className="p-1  text-[1rem] tracking-wider font-semibold text-gray-300 mt-1  ">
                      {titleValue}{' '}
                    </h1>{' '}
                    {isEditMode && (
                      <Pencil
                        size={12}
                        className="shrink-0 mt-2 mr-3 cursor-pointer"
                        onClick={() => setIsTitleEdit(true)}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* # Priority and Due Date */}
              <div className="pl-1  flex items-center justify-start mt-2 gap-3 ">
                {isEditMode ? (
                  <Select
                    value={priority}
                    onValueChange={(value) =>
                      setPriority(value as 'LOW' | 'MEDIUM' | 'HIGH')
                    }
                  >
                    <SelectTrigger
                      className={` min-w-[90px] border-white/10  text-[11px] tracking-widest shadow-none focus:ring-0  ${
                        priorityTextStyles[priority ?? 'N_A']
                      }`}
                    >
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent
                      position="popper"
                      align="start"
                      className="bg-dk_grey  bg-[#111] text-gray-300"
                    >
                      <SelectItem
                        value="LOW"
                        className=" hover:bg-lg_grey/20 hover:text-gray-100 tracking-widest text-[12px] cursor-pointer"
                      >
                        LOW
                      </SelectItem>

                      <SelectItem
                        value="MEDIUM"
                        className=" hover:bg-lg_grey/20 hover:text-gray-100  tracking-widest text-[12px] cursor-pointer"
                      >
                        MEDIUM
                      </SelectItem>

                      <SelectItem
                        value="HIGH"
                        className=" hover:bg-lg_grey/20 hover:text-gray-100 tracking-widest text-[12px] cursor-pointer"
                      >
                        HIGH
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div
                    className={`inline-flex rounded-md px-2  text-[10px] tracking-widest ${
                      priorityStyles[priority ?? 'N_A']
                    }`}
                  >
                    {priority}
                  </div>
                )}

                <div className="px-1 flex items-center gap-1 text-gray-400 rounded-md border-2 border-bg-lg_grey">
                  <CalendarPlus size={14} />
                  <p className="text-xs">{formatTaskDate(task?.createdAt)}</p>
                </div>
              </div>

              {/* #Info indicators */}
              <div
                className={`px-1   grid gap-3  ${
                  isExpanded ? 'grid-cols-4 mt-3' : 'grid-cols-2 mt-2'
                }`}
              >
                {/* #Status */}
                <div className=" p-2 bg-lg_grey/20 rounded-md">
                  <p className="text-gray-400 text-[10px] tracking-widest">
                    STATUS
                  </p>
                  {isStatusEdit ? (
                    <Select
                      value={status.id}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="relative h-5 w-full max-w-[130px] border border-white/[0.06] bg-white/[0.02] text-xs text-gray-200 shadow-none transition-colors duration-200 focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent
                        position="popper"
                        align="start"
                        className="cursor-pointer bg-dk_grey p-2 text-gray-300"
                      >
                        {availableStatus.map((val) => {
                          return (
                            <SelectItem
                              key={val.id}
                              value={val.id}
                              className="cursor-pointer border-none focus:bg-lg_grey/50 focus:text-white focus:outline-none focus:ring-0 data-[highlighted]:bg-lg_grey/50 data-[highlighted]:text-gray-200"
                            >
                              <div className="flex items-center gap-2 tracking-wider">
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    statusStyles[val.type].dot
                                  }`}
                                />
                                <span>{val.name}</span>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-1 px-2 tracking-widest text-[0.8rem] flex items-center gap-2 ">
                      <span
                        className={` inline-block h-2 w-2 rounded-full ${
                          statusStyles[status?.type ?? 'CUSTOM'].dot
                        }`}
                      />
                      {status.name}{' '}
                      {isEditMode && (
                        <Pencil
                          size={12}
                          className="ml-3 mt-[-4px] cursor-pointer"
                          onClick={() => setIsStatusEdit(true)}
                        />
                      )}{' '}
                    </div>
                  )}
                </div>

                {/* #Estimate */}
                <div className="p-2 bg-lg_grey/20 rounded-md">
                  <p className="text-gray-400 text-[10px] tracking-widest">
                    ESTIMATE
                  </p>
                  <div className="p-1 px-2 flex items-center gap-2 ">
                    <Clock size={18} className="text-yellow-600" />

                    {isEstimateEdit ? (
                      <div className="flex gap-2 ">
                        {' '}
                        <input
                          type="text"
                          value={estimateInput}
                          onChange={(e) => setEstimateInput(e.target.value)}
                          onBlur={handleEstimateValue}
                          className="w-[50px] bg-transparent border  border-yellow-900 px-1 outline-none focus:outline-none focus:ring-0"
                        />
                        <p className="text-[10px] tracking-wider">
                          {' '}
                          Eg. 2h,4d,3w
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center ">
                        <p className=" tracking-wider"> {estimateInput}</p>
                        {isEditMode && (
                          <Pencil
                            size={12}
                            className="ml-4 mt-[-4px] cursor-pointer"
                            onClick={() => setIsEstimateEdit(true)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* #Progress % */}
                <div className="p-2 bg-lg_grey/20 rounded-md">
                  <p className="text-gray-400 text-[10px] tracking-widest">
                    PROGRESS
                  </p>
                  <div className="p-1 px-2 flex gap-3 items-center  ">
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-full"
                      style={{
                        background: `conic-gradient(#398b57 ${progress}%, #2b2b2b ${progress}%)`,
                      }}
                    >
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[rgb(24,25,26)] text-[10px] text-white"></div>
                    </div>
                    {isprogressEdit ? (
                      <div className="p-0.5 flex gap-3 items-center cursor-pointer">
                        <Minus
                          size={16}
                          className="text-gray-100"
                          onClick={() =>
                            setProgress((prev) => Math.max(prev - 10, 0))
                          }
                        />

                        <input
                          type="text"
                          className="w-[34px] h-[20px] px-1 text-center bg-transparent rounded-sm border  border-gray-500 outline-none focus:outline-none focus:ring-0 text-[12px]"
                          value={progress}
                          onChange={(e) => setProgress(Number(e.target.value))}
                        />

                        <span className="ml-[-7px]">%</span>

                        <Plus
                          size={16}
                          className="text-gray-100"
                          onClick={() =>
                            setProgress((prev) => Math.min(prev + 10, 100))
                          }
                        />
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <p className="text-gray-300 text-xs tracking-widest flex flex-col">
                          {progress}%
                          <span className="text-[11px] leading-3 text-gray-400">
                            completed
                          </span>
                        </p>
                        {isEditMode && (
                          <Pencil
                            size={12}
                            className="ml-5 cursor-pointer"
                            onClick={() => setIsProgressEdit(true)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* #Assignee */}
                <div className="rounded-md bg-lg_grey/20 p-2">
                  <p className="text-[10px] tracking-widest text-gray-400">
                    ASSIGNEE
                  </p>

                  {isAssigneeEdit ? (
                    <Popover
                      open={isAssigneeEdit}
                      onOpenChange={setIsAssigneeEdit}
                    >
                      <PopoverTrigger asChild>
                        <div className="flex h-9 items-center gap-2 p-1 border border-purple-900">
                          {assignee ? (
                            <div className="flex items-center gap-1">
                              <Image
                                src={assignee?.avatar}
                                alt={assignee?.name ?? 'image'}
                                width={25}
                                height={25}
                                className="cursor-pointer rounded-full border border-dk_grey"
                              />
                              <p className="line-clamp-1">{assignee?.name}</p>
                            </div>
                          ) : (
                            <div
                              className=" flex items-center gap-1 tracking-wide"
                              title="unassigned"
                            >
                              <User2
                                size={24}
                                className="text-purple-600 text-sm bg-lg_grey p-[4px] rounded-full"
                              />{' '}
                              <span> Unassigned</span>
                            </div>
                          )}
                          {isEditMode && (
                            <X
                              size={14}
                              className="cursor-pointer"
                              onClick={() => setIsAssigneeEdit(true)}
                            />
                          )}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className="w-[250px] h-[250px] mr-[-7px] minimal-scrollbar border border-white/[0.06] bg-dk_grey p-2"
                      >
                        <Command className="">
                          <CommandInput
                            placeholder="Search members..."
                            className="border-none outline:none text-gray-300 focus:outline-none  focus:ring-0 pl-1 bg-transparent overflow-y-auto"
                          />

                          <CommandList>
                            <CommandEmpty className="text-gray-400">
                              No member found.
                            </CommandEmpty>

                            <CommandGroup>
                              {membersList.map((member) => (
                                <CommandItem
                                  key={member.id}
                                  value={member.name}
                                  className="cursor-pointer hover:bg-lg_grey/40 "
                                  onSelect={() => {
                                    setAssignee(member)
                                    setIsAssigneeEdit(false)
                                  }}
                                >
                                  <div className="flex items-center gap-2  line-clamp-2">
                                    <Image
                                      src={member.avatar}
                                      alt={member.name}
                                      width={22}
                                      height={22}
                                      className="rounded-full"
                                    />
                                    <span className="text-gray-300">
                                      {member.name}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <div className="flex h-9 items-center gap-2 p-1">
                      {assignee ? (
                        <div className="flex items-center gap-1">
                          <Image
                            src={assignee?.avatar}
                            alt={assignee?.name ?? 'image'}
                            width={25}
                            height={25}
                            className="cursor-pointer rounded-full border border-dk_grey"
                          />
                          <p className="line-clamp-1">{assignee?.name}</p>
                        </div>
                      ) : (
                        <div
                          className=" flex items-center gap-1 tracking-wide"
                          title="unassigned"
                        >
                          <User2
                            size={24}
                            className="text-purple-600 text-sm bg-lg_grey p-[4px] rounded-full "
                          />{' '}
                          <span> Unassigned</span>
                        </div>
                      )}

                      {isEditMode && (
                        <X
                          size={16}
                          className="cursor-pointer"
                          onClick={() => setIsAssigneeEdit(true)}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* #Description */}
              <div
                className={`flex  gap-1 overflow-hidden mx-1 p-2 ${
                  isExpanded ? 'items-start' : 'items-center'
                }`}
              >
                <FileText
                  size={15}
                  className={`shrink-0 text-purple-400 ${
                    isExpanded ? 'mt-1' : 'items-center'
                  }`}
                />

                {isExpanded ? (
                  isDescEdit ? (
                    <textarea
                      className="ml-1 p-1 w-full bg-transparent   mt-1 text-gray-300 max-w-[90%] border border-purple-900 outline-none focus:outline-none focus:ring-0"
                      value={descValue}
                      onChange={(e) => setDescValue(e.target.value)}
                    />
                  ) : (
                    <div className=" w-[89%] px-1 flex">
                      {descValue}
                      {isEditMode && (
                        <Pencil
                          size={12}
                          className="shrink-0 ml-5 cursor-pointer"
                          onClick={() => setIsDescEdit(true)}
                        />
                      )}
                    </div>
                  )
                ) : (
                  <p className="truncate text-sm text-gray-400">
                    {task?.description}
                  </p>
                )}

                {!isExpanded && (
                  <button
                    className="shrink-0 text-xs text-purple-400 tracking-wider"
                    onClick={() => setIsExPanded(true)}
                  >
                    See more
                  </button>
                )}
              </div>

              <div className="min-h-0 mx-1 mt-2 mb-1 flex-1 ">
                <TaskTabs
                  taskId={task?.id}
                  boardId={boardId}
                  isEditMode={isEditMode}
                  isExpanded={isExpanded}
                />
              </div>

              {/* CANCEL & SAVE BUTTONS */}

              {isEditMode && (
                <div className="sticky  px-2 pt-1 pb-1 transition-all ease-in-out duration-200">
                  <div
                    className={`grid ${
                      isExpanded ? 'grid-cols-4' : 'grid-cols-2'
                    }   gap-3`}
                  >
                    {/* CANCEL */}
                    <button
                      className={`flex h-8 min-w-[130px] items-center justify-center rounded-sm border border-gray-700 gap-2 px-5 text-sm font-medium tracking-widest text-gray-300 bg-lg_grey/10 hover:text-gray-200 hover:bg-lg_grey/30  ${
                        isExpanded ? ' col-start-3' : ''
                      } disabled:text-gray-400`}
                      onClick={handleCancel}
                      disabled={updateTaskMutation.isPending}
                    >
                      <X size={16} />
                      Cancel
                    </button>

                    {/* SAVE */}
                    <button
                      className="flex h-8 min-w-[130px] items-center justify-center gap-2 rounded-sm border border-purple-900 bg-lg_grey/20 px-5 text-sm font-medium tracking-widest text-purple-500  hover:text-purple-400 hover:border-purple-800 hover:bg-lg_grey/30"
                      onClick={handleSave}
                    >
                      {updateTaskMutation.isPending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Check size={16} />
                      )}
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default TaskDetailsSheet
