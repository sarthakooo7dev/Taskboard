import Image from 'next/image'
import {
  Construction,
  Gauge,
  Layers2,
  MoreVertical,
  WeightTilde,
} from 'lucide-react'
import { WorkloadProps } from '@/app/types/general.types'

const Workload = ({ workloadData, isLoading }: WorkloadProps) => {
  const maxWorkload = Math.max(
    ...workloadData?.map((member) => member.workloadMinutes),
    1,
  )

  const visibleData = workloadData.slice(0, 3)

  return (
    <div className="p-1  h-full flex flex-col ">
      {/* Header */}
      <div className=" p-2 flex items-center justify-between gap-2  text-gray-300  ">
        <div className="flex items-center gap-2">
          <Gauge size={18} />
          <h3 className="text-sm font-medium tracking-wider ">Team Workload</h3>
        </div>

        <div className="flex items-center gap-1 text-[10px] tracking-wide text-gray-400">
          <Layers2 size={12} />
          Top 3 by workload
        </div>
      </div>

      {/* Users */}
      <div className=" p-1  flex-1 grid grid-rows-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="m-2 animate-pulse rounded-md bg-white/5"
              />
            ))
          : visibleData?.map((member) => {
              const activeBars = Math.max(
                1,
                Math.round((member.workloadMinutes / maxWorkload) * 10),
              )

              return (
                <div
                  key={member.id}
                  className="flex-1 flex items-center gap-2 px-1"
                >
                  {/* Avatar */}
                  <Image
                    src={member.avatar || '/avatars/avatar1.png'}
                    alt={member.name}
                    width={22}
                    height={22}
                    className="rounded-full"
                  />

                  {/* Name */}
                  <p className="w-[120px] truncate text-[12px] text-gray-300 tracking-wider">
                    {member.name}
                  </p>

                  {/* Task count */}
                  <p className="w-[45px] text-[11px] text-gray-500">
                    {member.activeTasks} tasks
                  </p>

                  {/* Workload bars */}
                  <div className="flex flex-1 gap-[3px]">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <div
                        key={index}
                        className={`h-[5px] flex-1 rounded-sm ${
                          index < activeBars ? 'bg-violet-500/70' : 'bg-white/5'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
      </div>
    </div>
  )
}

export default Workload
