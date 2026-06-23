import {
  FolderKanban,
  Check,
  LoaderCircle,
  TriangleAlert,
  Gauge,
  Layers2,
  Dot,
  Circle,
  Kanban,
  Folder,
} from 'lucide-react'
import { WorkspaceProps } from '@/app/types/general.types'
import { getBoardVisual } from '@/app/lib/utils/ui/boardHelpers'
import WorkspaceSkeleton from '../loader-components/WorkspaceSkeleton'
import { useRouter } from 'next/navigation'

const WorkspaceOverview = ({ workspaceData, isLoading }: WorkspaceProps) => {
  const router = useRouter()
  const workspaceVisibleData = workspaceData.slice(0, 3)
  const truncateName = (name: string, max = 15) =>
    name.length > max ? `${name.slice(0, max)}...` : name

  const handleNavigate = (boardId: string, title: string) => {
    router.push(
      `/dashboard/boards/${boardId}?title=${encodeURIComponent(title)}`,
    )
  }

  return (
    <div className="flex h-full flex-col p-1">
      {/* Header */}
      <div className=" p-2 flex items-center justify-between gap-2 text-gray-300/90 ">
        <div className="flex items-center gap-2">
          <Folder size={18} className="text-purple-400" />
          <h3 className="text-sm font-medium tracking-wider ">
            Workspace Overview
          </h3>
        </div>

        <div className="flex items-center gap-1 text-[10px] tracking-wide text-gray-400">
          <Layers2 size={10} />
          Recent workspaces
        </div>
      </div>

      <div className="flex-1 grid grid-rows-3 p-2">
        {isLoading ? (
          <WorkspaceSkeleton />
        ) : (
          workspaceVisibleData.map((board) => {
            const { Icon } = getBoardVisual(board.id)

            return (
              <div
                key={board.id}
                className="grid grid-cols-[1.7fr_1.4fr] items-center gap-1 hover:bg-lg_grey/30 p-1 px-2 rounded-md cursor-pointer"
                onClick={() => handleNavigate(board.id, board.name)}
              >
                {/* Left */}
                <div className="flex items-start gap-3 ">
                  <div className="mt-[2px] rounded-md bg-violet-500/10 p-2">
                    <Icon size={15} className="text-violet-400" />
                  </div>

                  <div>
                    <p className="text-[13px] tracking-wider truncate text-gray-300/80">
                      {truncateName(board.name)}
                    </p>

                    <p className=" text-[11px] text-gray-500">
                      {board.totalTasks} tasks
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="">
                  <div className=" flex items-center">
                    <div className="h-[5px]  flex-1 overflow-hidden rounded-full bg-white/5 ">
                      <div
                        className="h-full rounded-full bg-violet-500/80"
                        style={{
                          width: `${board.progress}%`,
                        }}
                      />
                    </div>

                    <div className="pl-3">
                      <span className="text-[11px] tracking-widest font-medium text-gray-400">
                        {board.progress}%
                      </span>
                    </div>
                  </div>

                  <div className=" flex items-center justify-end gap-5 text-[11px] px-2">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Circle
                        size={7}
                        className="bg-blue-500/80 rounded-full"
                      />
                      {board.doneTasks}
                    </div>

                    <div className="flex items-center gap-2 text-green-400">
                      <Circle
                        size={7}
                        className="bg-green-400/70 rounded-full"
                      />
                      {board.inProgressTasks}
                    </div>

                    <div className="flex items-center gap-2 text-red-400">
                      <Circle size={7} className="bg-red-400/80 rounded-full" />
                      {board.blockedTasks}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default WorkspaceOverview
