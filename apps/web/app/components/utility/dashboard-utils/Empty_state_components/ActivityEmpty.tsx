import { Activity, Sparkles, Zap } from 'lucide-react'
import React from 'react'

const ActivityEmpty = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center px-3 text-center">
      {/* Illustration */}
      <div className="relative mt-[-12px]">
        <div className="absolute inset-0 rounded-full bg-violet-600/10 blur-3xl" />

        <div className=" relative flex h-14 w-14 items-center justify-center rounded-full border border-violet-500/10 bg-gradient-to-br from-violet-500/10 to-violet-500/5">
          <Activity className="h-7 w-7 text-violet-400" />

          <div className="absolute -right-6 -top-1 rounded-full border border-violet-500/20 bg-[#17171d] p-2 shadow-lg">
            <Sparkles className="h-4 w-4 text-violet-400" />
          </div>

          <div className="absolute -left-3 bottom-3 h-2 w-2 rounded-full bg-violet-500/70" />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg  mt-2 font-semibold text-gray-500 tracking-wide">
        No activity yet
      </h3>

      <p className="  text-sm  tracking-wide text-gray-500">
        Activity from your workspaces will appear here.
      </p>
    </div>
  )
}

export default ActivityEmpty
