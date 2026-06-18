import { MyTasksProps } from '@/app/types/general.types'
import {
  CircleAlert,
  CircleDashed,
  ClipboardList,
  ClockArrowDown,
  FileBox,
  Info,
  Layers2,
  LayoutList,
  Sprout,
} from 'lucide-react'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MyTasksRow from './myTasksRow'
import MyTasksSkeleton from '../loader-components/MyTasksSkeleton'

const MyTasks = ({ myTasksData, isLoading }: MyTasksProps) => {
  const tasksByStatus = {
    NOT_STARTED: myTasksData.filter(
      (task) => task.column.type === 'NOT_STARTED',
    ),
    IN_PROGRESS: myTasksData.filter(
      (task) => task.column.type === 'IN_PROGRESS',
    ),
    BLOCKED: myTasksData.filter((task) => task.column.type === 'BLOCKED'),
  }
  const defaultTab =
    tasksByStatus.IN_PROGRESS.length > 0
      ? 'IN_PROGRESS'
      : tasksByStatus.BLOCKED.length > 0
      ? 'BLOCKED'
      : 'NOT_STARTED'
  return (
    <div className="h-full flex flex-col p-1 min-h-0">
      {/* Header */}
      <div className="p-2 flex items-center justify-between gap-2 text-gray-300/90 ">
        <div className="flex items-center gap-2">
          <LayoutList size={18} />
          <h3 className="text-sm font-medium tracking-wider">My Work</h3>
        </div>

        <div className="flex items-center gap-1 text-[10px] tracking-wide text-gray-400">
          <Layers2 size={10} />
          Tasks assigned to you
        </div>
      </div>

      <div className="flex-1 min-h-0 px-2">
        <Tabs
          defaultValue={defaultTab}
          className="flex h-full min-h-0 flex-col  "
        >
          <TabsList className="grid grid-cols-3 w-[65%] bg-lg_grey/30  ">
            <TabsTrigger
              value="NOT_STARTED"
              className="text-gray-400 tracking-wider  data-[state=active]:text-gray-300/90  data-[state=active]:bg-lg_grey/70 "
            >
              <ClockArrowDown className="size-3.5 text-amber-600" />
              Not Started{' '}
              <span className="text-[12px] ">
                ({tasksByStatus.NOT_STARTED.length})
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="IN_PROGRESS"
              className="text-gray-400 tracking-wider  data-[state=active]:text-gray-300/90 data-[state=active]:bg-lg_grey/90 "
            >
              <Sprout className="size-3.5 text-green-600 " />
              In Progress{' '}
              <span className="text-[12px]">
                ({tasksByStatus.IN_PROGRESS.length})
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="BLOCKED"
              className="text-gray-400 tracking-wider data-[state=active]:text-gray-300/90  data-[state=active]:bg-lg_grey/90 "
            >
              <CircleAlert className="size-3.5 text-red-400" />
              Blocked{' '}
              <span className="text-[12px]">
                ({tasksByStatus.BLOCKED.length})
              </span>
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <MyTasksSkeleton />
          ) : (
            <>
              <TabsContent
                value="NOT_STARTED"
                className=" flex-1 min-h-0 overflow-y-auto minimal-scrollbar [scrollbar-gutter:stable] rounded-md   mt-[-2px] mb-1 "
              >
                {tasksByStatus.NOT_STARTED.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <Info size={18} className="mx-auto mb-2 text-gray-500" />

                      <p className="text-xs text-gray-500 tracking-wider">
                        No pending tasks
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Tasks waiting to be started will appear here.
                      </p>
                    </div>
                  </div>
                ) : (
                  tasksByStatus.NOT_STARTED.map((task) => (
                    <MyTasksRow key={task.id} task={task} />
                  ))
                )}
              </TabsContent>

              <TabsContent
                value="IN_PROGRESS"
                className="flex-1 min-h-0 overflow-y-auto minimal-scrollbar  [scrollbar-gutter:stable] rounded-md   mt-[-2px] mb-1 "
              >
                {tasksByStatus.IN_PROGRESS.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <Info size={18} className="mx-auto mb-2 text-gray-500" />

                      <p className="text-xs text-gray-500 tracking-wider">
                        Nothing in progress
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Active tasks assigned to you will show up here.
                      </p>
                    </div>
                  </div>
                ) : (
                  tasksByStatus.IN_PROGRESS.map((task) => (
                    <MyTasksRow key={task.id} task={task} />
                  ))
                )}
              </TabsContent>

              <TabsContent
                value="BLOCKED"
                className="flex-1 min-h-0 overflow-y-auto minimal-scrollbar [scrollbar-gutter:stable] rounded-md   mt-[-2px] mb-1"
              >
                {tasksByStatus.BLOCKED.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <Info size={18} className="mx-auto mb-2 text-gray-500" />

                      <p className="text-xs text-gray-500 tracking-wider">
                        No blockers detected
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        All assigned work is progressing as expected.
                      </p>
                    </div>
                  </div>
                ) : (
                  tasksByStatus.BLOCKED.map((task) => (
                    <MyTasksRow key={task.id} task={task} />
                  ))
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  )
}

export default MyTasks
