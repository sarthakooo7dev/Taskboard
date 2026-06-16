const WorkloadSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center gap-2 px-1">
          {/* Avatar */}
          <div className="h-[22px] w-[22px] animate-pulse rounded-full bg-white/5" />

          {/* Name */}
          <div className="h-3 w-[120px] animate-pulse rounded bg-white/5" />

          {/* Task count */}
          <div className="h-3 w-[45px] animate-pulse rounded bg-white/5" />

          {/* Workload bars */}
          <div className="flex flex-1 gap-[3px]">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-[5px] flex-1 animate-pulse rounded-sm bg-white/5"
              />
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

export default WorkloadSkeleton
