import Image from 'next/image'
import {
  Construction,
  Gauge,
  Layers2,
  MoreVertical,
  WeightTilde,
} from 'lucide-react'
import { WorkloadProps } from '@/app/types/general.types'
import WorkloadSkeleton from '../loader-components/WorkloadSkeleton'
import WorkloadEmpty from './Empty_state_components/WorkloadEmpty'

const Workload = ({ workloadData, isLoading }: WorkloadProps) => {
  const maxWorkload = Math.max(
    ...workloadData?.map((member) => member.workloadMinutes),
    1,
  )

  const visibleData = workloadData.slice(0, 4)

  return (
    <div className="p-1  h-full flex flex-col ">
      {/* Header */}
      <div className=" p-2 flex items-center justify-between gap-2 text-gray-300/90 ">
        <div className="flex items-center gap-2">
          <Gauge size={18} className="text-purple-400" />
          <h3 className="text-sm font-medium tracking-wider ">Team Workload</h3>
        </div>

        <div className="flex items-center gap-1 text-[10px] tracking-wide text-gray-400">
          <Layers2 size={10} />
          Top 4 by workload
        </div>
      </div>

      {/* Users */}
      <div className=" p-2  flex-1 grid grid-rows-4">
        {isLoading ? (
          <WorkloadSkeleton />
        ) : visibleData.length == 0 ? (
          <div className="row-span-4 flex items-center justify-center">
            <WorkloadEmpty />
          </div>
        ) : (
          visibleData?.map((member) => {
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
                  width={25}
                  height={25}
                  className="rounded-full"
                />

                {/* Name */}
                <p className="w-[120px] truncate text-[12px] text-gray-300/80 tracking-wider">
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
                      className={`h-[7px] w-[8px]   rounded-sm ${
                        index < activeBars ? 'bg-violet-500/70' : 'bg-white/5'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Workload
