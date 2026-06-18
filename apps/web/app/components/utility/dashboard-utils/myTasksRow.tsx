import { formatEstimate } from '@/app/lib/utils/ui/boardHelpers'
import { MyTaskRowProps } from '@/app/types/general.types'
import {
  ArrowRight,
  Clock3,
  FolderKanban,
  Tag,
  FileText,
  Sprout,
  Presentation,
  Link,
  SquareArrowOutUpRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

const priorityStyling = {
  HIGH: 'text-red-500/90 text-[11px] tracking-wider',
  MEDIUM: 'text-amber-600/90 text-[11px] tracking-wider',
  LOW: 'text-zinc-400 text-[11px] tracking-wider',
}

const MyTasksRow = ({ task }: MyTaskRowProps) => {
  const router = useRouter()
  const handleNavToTaskPage = (
    boardId: string,
    title: string,
    taskId: string,
  ) => {
    router.push(
      `/dashboard/boards/${boardId}?title=${encodeURIComponent(
        title,
      )}&taskId=${taskId}`,
    )
  }

  return (
    <div className="group flex items-center gap-4 border-b border-white/[0.04] px-5 py-3 transition-all  ">
      {/* Left Icon */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.04] bg-white/[0.03]">
        <FileText size={15} className="text-gray-400" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium tracking-wider text-gray-300/80">
          {task.title}
        </p>

        <div className="mt-[2px] flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Presentation size={12} />
            <span>{task.board.name}</span>
          </div>

          <span className="h-3 w-px bg-white/10" />

          <div className="flex items-center gap-1.5">
            <Clock3 size={12} />
            <span>{formatEstimate(task.estimate)}</span>
          </div>

          <span className="h-3 w-px bg-white/10" />

          <div className="flex items-center gap-1.5 tracking-wider">
            <Sprout size={12} />
            <span>{task.progress}%</span>
          </div>

          <span className="h-3 w-px bg-white/10" />

          <div className="flex items-center gap-1.5">
            <Tag size={12} />
            <span className={priorityStyling[task.Priority]}>
              {task.Priority}
            </span>
          </div>
        </div>
      </div>

      {/* Open Action */}

      <div
        className="p-2  cursor-pointer"
        onClick={() =>
          handleNavToTaskPage(task.board.id, task.board.name, task.id)
        }
      >
        <SquareArrowOutUpRight size={18} className=" text-gray-300/80  " />
      </div>
    </div>
  )
}

export default MyTasksRow
