import { ROUTES } from '@/app/lib/ui.routes'
import { FolderPlus, Folders, Plus, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const WorkspaceEmpty = () => {
  const worskspace_route = ROUTES.boards
  const router = useRouter()

  const handleNavToWorkspace = () => {
    router.push(worskspace_route)
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-2 text-center">
      {/* Illustration */}
      <div className="relative ">
        <div className="absolute inset-0 rounded-sm bg-violet-600/10 blur-2xl" />

        <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-violet-500/10 bg-gradient-to-br from-violet-500/10 to-violet-500/5">
          <Folders className="h-6 w-6 text-violet-400" />
        </div>
      </div>

      {/* Description */}
      <p className=" text-[13px] mt-3 text-gray-500 tracking-wide">
        Organize boards, tasks and your team in one place.
      </p>

      {/* CTA */}
      <button
        className="mt-2 inline-flex items-center gap-2 rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-2  text-xs font-medium text-violet-300  tracking-wider"
        onClick={handleNavToWorkspace}
      >
        <Plus className="h-3.5 w-3.5" />
        Create Workspace
      </button>
    </div>
  )
}

export default WorkspaceEmpty
