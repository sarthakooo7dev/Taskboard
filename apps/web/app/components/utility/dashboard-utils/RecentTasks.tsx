import { FileBox, Layers2 } from 'lucide-react'
import React from 'react'

const RecentTasks = () => {
  return (
    <div className="p-1  h-full flex flex-col ">
      {/* Header */}
      <div className=" p-2 flex items-center justify-between gap-2  text-gray-300  ">
        <div className="flex items-center gap-2">
          <FileBox size={18} />
          <h3 className="text-sm font-medium tracking-wider ">Recent Tasks</h3>
        </div>

        <div className="flex items-center gap-1 text-[10px] tracking-wide text-gray-400">
          <Layers2 size={10} />
          last 3 updated tasks
        </div>
      </div>
    </div>
  )
}

export default RecentTasks
