const WorkspaceSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[1.7fr_1.4fr] items-start gap-1"
        >
          {/* Left */}
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="mt-[2px] h-[32px] w-[32px] animate-pulse rounded-md bg-white/5" />

            {/* Text */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="h-3 w-28 animate-pulse rounded bg-white/5" />
              <div className="h-2 w-16 animate-pulse rounded bg-white/5" />
            </div>
          </div>

          {/* Right */}
          <div>
            {/* Progress */}
            <div className="flex items-center">
              <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-white/5">
                <div className="h-full w-[60%] animate-pulse rounded-full bg-violet-500/20" />
              </div>

              <div className="pl-3">
                <div className="h-3 w-8 animate-pulse rounded bg-white/5" />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-2 flex items-center justify-end gap-5 px-2">
              <div className="h-3 w-6 animate-pulse rounded bg-white/5" />
              <div className="h-3 w-6 animate-pulse rounded bg-white/5" />
              <div className="h-3 w-6 animate-pulse rounded bg-white/5" />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default WorkspaceSkeleton
