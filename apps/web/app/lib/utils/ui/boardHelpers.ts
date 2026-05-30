import { availableStatusType } from '@/app/types/general.types'
import {
  Aperture,
  AudioWaveform,
  Component,
  Box,
  Cannabis,
  Origami,
  ShipWheel,
  Anchor,
  EggFried,
  Compass,
} from 'lucide-react'

const ICONS = [
  Aperture,
  AudioWaveform,
  Component,
  Cannabis,
  Origami,
  ShipWheel,
  Anchor,
  EggFried,
  Compass,
]

const COLORS = [
  'bg-purple-800/10 text-purple-400',
  // 'bg-red-400/20 text-red-300',
  // 'bg-green-400/20 text-green-400',
  // 'bg-lime-400/20 text-lime-400',
]

export const statusStyles = {
  NOT_STARTED: {
    dot: 'bg-gray-400',
    label: 'Not Started',
  },

  IN_PROGRESS: {
    dot: 'bg-green-500',
    label: 'In Progress',
  },

  BLOCKED: {
    dot: 'bg-red-500',
    label: 'Blocked',
  },

  DONE: {
    dot: 'bg-blue-400',
    label: 'Done',
  },

  CUSTOM: {
    dot: 'bg-purple-400',
    label: 'Custom',
  },
}

export const priorityStyles = {
  LOW: 'bg-gray-500/10 text-gray-400 border border-gray-400/10',

  MEDIUM: 'bg-amber-500/10 text-amber-500 border border-amber-500/10',

  HIGH: 'bg-red-500/10 text-red-400 border border-red-500/10',

  N_A: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/10',
}

export const priorityTextStyles = {
  LOW: 'text-gray-400',

  MEDIUM: 'text-amber-500',

  HIGH: 'text-red-400',

  N_A: 'text-cyan-400',
}

const getSeed = (id: string) =>
  id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)

export const getBoardVisual = (boardId: string) => {
  const seed = getSeed(boardId)
  const index = seed % ICONS.length
  return {
    Icon: ICONS[index]!,
    bg: COLORS[index % COLORS.length],
  }
}

export const getBoardState = (blocked: number) => {
  if (blocked > 0) {
    return {
      label: `At risk • ${blocked} Issue${blocked > 1 ? 's' : ''}`,
      color: 'text-orange-600',
    }
  }

  return {
    label: 'Stable • No Issues',
    color: 'text-green-600',
  }
}

export const formatTimeAgo = (isoDate: string) => {
  const now = Date.now()
  const past = new Date(isoDate).getTime()
  const diff = now - past

  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  if (weeks < 4) return `${weeks}w ago`
  if (months < 12) return `${months}mo ago`

  return `${Math.floor(days / 365)}y ago`
}

export const formatEstimate = (minutes: number) => {
  const MINUTES_IN_HOUR = 60

  const MINUTES_IN_DAY = 8 * 60

  const MINUTES_IN_WEEK = 5 * MINUTES_IN_DAY

  if (minutes < MINUTES_IN_HOUR) {
    return `${minutes}m`
  }

  if (minutes < MINUTES_IN_DAY) {
    const hours = minutes / MINUTES_IN_HOUR

    return `${Number(hours.toFixed(1))}h`
  }

  if (minutes < MINUTES_IN_WEEK) {
    const days = minutes / MINUTES_IN_DAY

    return `${Number(days.toFixed(1))}d`
  }

  const weeks = minutes / MINUTES_IN_WEEK

  return `${Number(weeks.toFixed(1))}w`
}

export const formatTaskDate = (date?: string) => {
  if (!date) {
    return '-- -- --'
  }

  const formatted = new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  })
  const parts = formatted.split(' ')

  return `${parts[0]} ${parts[1]}, ${parts[2]}`
}

export const calculateProgress = (
  taskStatus: availableStatusType,
  currentProgress: number,
) => {
  let newProgress = currentProgress
  // CASE 1: User is moving task TO Done
  if (taskStatus.type === 'DONE') {
    return (newProgress = 100)
  }

  // CASE 2: User is moving task TO NOT_STARTED
  else if (taskStatus.type === 'NOT_STARTED') {
    return (newProgress = 0)
  }

  // CASE 3: // Moving FROM Not Started to active status
  else if (currentProgress === 0) {
    return (newProgress = 10)
  }

  // CASE 4: // Any NON-DONE status
  else if (currentProgress === 100) {
    return (newProgress = 90)
  }

  return newProgress
}

type ParseEstimateResult =
  | {
      success: true
      minutes: number
    }
  | {
      success: false
      error: string
    }

export const parseEstimateToMinutes = (value: string): ParseEstimateResult => {
  const normalized = value.toLowerCase().trim()

  if (!normalized) {
    return {
      success: false,
      error: 'Estimate is required',
    }
  }

  const regex = /^(\d+\s*(w|week|weeks|d|day|days|h|hr|hour|hours|m|min|minute|minutes)\s*)+$/

  if (!regex.test(normalized)) {
    return {
      success: false,
      error: 'Invalid format. Examples: 2h, 3d, 1w 2d, 30m',
    }
  }

  let totalMinutes = 0

  const weekMatch = normalized.match(/(\d+)\s*(w|week|weeks)/g)

  const dayMatch = normalized.match(/(\d+)\s*(d|day|days)/g)

  const hourMatch = normalized.match(/(\d+)\s*(h|hr|hour|hours)/g)

  const minuteMatch = normalized.match(/(\d+)\s*(m|min|minute|minutes)/g)

  weekMatch?.forEach((item) => {
    const num = Number(item.match(/\d+/)?.[0])
    totalMinutes += num * 5 * 8 * 60
  })

  dayMatch?.forEach((item) => {
    const num = Number(item.match(/\d+/)?.[0])
    totalMinutes += num * 8 * 60
  })

  hourMatch?.forEach((item) => {
    const num = Number(item.match(/\d+/)?.[0])
    totalMinutes += num * 60
  })

  minuteMatch?.forEach((item) => {
    const num = Number(item.match(/\d+/)?.[0])
    totalMinutes += num
  })

  return {
    success: true,
    minutes: totalMinutes,
  }
}

export const formatCommentTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  if (isToday) {
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const yesterday = new Date()
  yesterday.setDate(now.getDate() - 1)

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()

  if (isYesterday) {
    return `Yesterday ${date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })}`
  }

  return (
    date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    }) +
    ', ' +
    date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })
  )
}
