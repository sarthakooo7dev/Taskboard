import { QuickInsightsProps } from '@/app/types/general.types'
import {
  AlertTriangle,
  Circle,
  Clock3,
  Info,
  Layers2,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const QuickInsights = ({ quickInsights, isLoading }: QuickInsightsProps) => {
  const stats = {
    inProgress: quickInsights?.InProgressTasks ?? 0,
    notStarted: quickInsights?.NotStartedTasks ?? 0,
    blocked: quickInsights?.BlockedTasks ?? 0,
  }
  const total = stats.inProgress + stats.notStarted + stats.blocked

  const inProgressPct = total === 0 ? 0 : (stats.inProgress / total) * 100

  const notStartedPct = total === 0 ? 0 : (stats.notStarted / total) * 100

  const blockedPct = total === 0 ? 0 : (stats.blocked / total) * 100
  const rings = [
    {
      radius: 48,
      value: inProgressPct,
      color: '#7353ca',
      transform: 'rotate(-40 65 65)',
    },
    {
      radius: 39,
      value: notStartedPct,
      color: '#fbbf24',
      transform: 'rotate(-25 65 65)',
    },
    {
      radius: 30,
      value: blockedPct,
      color: '#f87171',
      transform: 'rotate(-10 65 65)',
    },
  ]

  const [animateChart, setAnimateChart] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setAnimateChart(true)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [isLoading])

  return (
    <div className="h-full flex flex-col p-1 min-h-0">
      {/* Header */}
      <div className="p-2 flex items-center justify-between text-gray-300/90">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-purple-400" />
          <h3 className="text-sm font-medium tracking-wider">Quick Insights</h3>
        </div>

        <div className="flex items-center gap-1 text-[10px] tracking-wide text-gray-400">
          <Layers2 size={10} />
          Across all boards
        </div>
      </div>

      <div className="flex-1 min-h-0 p-3 ">
        <div className="flex  items-stretch ">
          {/* LEFT */}
          <div className="w-[40%]  flex flex-col items-center justify-center  py-0  ">
            <svg width="130" height="130" viewBox="0 0 130 130">
              {rings.map((ring) => {
                const circumference = 2 * Math.PI * ring.radius

                return (
                  <g key={ring.radius}>
                    <circle
                      cx="65"
                      cy="65"
                      r={ring.radius}
                      fill="none"
                      stroke="rgba(255,255,255,0.02)"
                      strokeWidth="9"
                    />

                    <circle
                      cx="65"
                      cy="65"
                      r={ring.radius}
                      fill="none"
                      stroke={ring.color}
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={
                        animateChart
                          ? circumference - (ring.value / 100) * circumference
                          : circumference
                      }
                      style={{
                        transition:
                          'stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                      transform={ring.transform}
                    />
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Divider */}
          <div className="h-[75%] w-px bg-white/[0.05] " />

          {/* RIGHT */}
          <div className="flex-1 flex flex-col justify-center px-2">
            {isLoading ? (
              <div className="flex flex-col justify-center px-2">
                {[1, 2, 3].map((item) => (
                  <div key={item}>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-white/[0.04] animate-pulse" />

                        <div className="h-3 w-24 rounded bg-white/[0.04] animate-pulse" />
                      </div>

                      <div className="h-3 w-8 rounded bg-white/[0.04] animate-pulse" />
                    </div>

                    {item !== 3 && <div className="h-px bg-white/[0.05]" />}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    {inProgressPct > 50 ? (
                      <>
                        <TrendingUp size={14} className="text-purple-300" />
                        <span className="text-[12px] text-gray-300/80 tracking-widest">
                          Strong Momentum
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown size={14} className="text-purple-300" />
                        <span className="text-[12px] text-gray-300/80 tracking-widest">
                          Low Momentum
                        </span>
                      </>
                    )}
                  </div>

                  <span className="text-xs font-medium text-purple-400 mr-[-8px] tracking-wider">
                    {Math.round(inProgressPct)}%
                  </span>
                </div>

                <div className="h-px bg-white/[0.05]" />

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Clock3 size={14} className="text-amber-500" />
                    <span className="text-[12px] text-gray-300/80 tracking-widest">
                      Work Ahead
                    </span>
                  </div>

                  <span className="text-xs font-medium text-gray-400">
                    {stats.notStarted}
                  </span>
                </div>

                <div className="h-px bg-white/[0.05]" />

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-red-500" />
                    <span className="text-[12px] text-gray-300/80 tracking-widest">
                      Blocked Work
                    </span>
                  </div>

                  <span className="text-xs font-medium text-gray-400">
                    {stats.blocked}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickInsights
