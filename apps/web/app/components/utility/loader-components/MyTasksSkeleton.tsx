const MyTasksSkeleton = () => {
  return (
    <div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 border-b border-white/[0.04] px-5 py-3"
        >
          {/* Icon */}
          <div className="h-7 w-7 shrink-0 animate-pulse rounded-md bg-white/[0.04]" />

          {/* Content */}
          <div className="flex-1">
            {/* Title */}
            <div className="h-4 w-40 animate-pulse rounded bg-white/[0.05]" />

            {/* Metadata */}
            <div className="mt-[6px] flex items-center gap-4">
              <div className="h-3 w-16 animate-pulse rounded bg-white/[0.04]" />

              <span className="h-3 w-px bg-white/[0.05]" />

              <div className="h-3 w-10 animate-pulse rounded bg-white/[0.04]" />

              <span className="h-3 w-px bg-white/[0.05]" />

              <div className="h-3 w-8 animate-pulse rounded bg-white/[0.04]" />

              <span className="h-3 w-px bg-white/[0.05]" />

              <div className="h-3 w-12 animate-pulse rounded bg-white/[0.04]" />
            </div>
          </div>

          {/* Open button */}
          <div className="h-8 w-8 animate-pulse rounded-md bg-white/[0.04]" />
        </div>
      ))}
    </div>
  )
}

export default MyTasksSkeleton
