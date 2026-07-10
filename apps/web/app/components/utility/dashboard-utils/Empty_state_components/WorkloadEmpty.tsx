import { Gauge, Sparkles } from 'lucide-react'
import React from 'react'

const WorkloadEmpty = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center px-2 text-center">
      {/* Illustration */}
      <div className="relative mt-[-7px] ">
        <div className="absolute inset-0 rounded-full bg-violet-600/10 blur-2xl" />

        <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-violet-500/10 bg-gradient-to-br from-violet-500/10 to-violet-500/5">
          <Gauge className="h-6 w-6 text-violet-400" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[15px] mt-3 font-semibold text-gray-500 tracking-wide">
        No workload data
      </h3>

      {/* Description */}
      <p className=" text-[13px]  text-gray-500 tracking-wide">
        Assign tasks to visualize your team's workload.
      </p>
    </div>
  )
}

export default WorkloadEmpty
