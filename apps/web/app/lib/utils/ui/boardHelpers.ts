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
  const MINUTES_IN_DAY = 60 * 8
  const MINUTES_IN_WEEK = MINUTES_IN_DAY * 5

  if (minutes < MINUTES_IN_HOUR) {
    return `${minutes}m`
  }
  if (minutes < MINUTES_IN_DAY) {
    const hours = Math.floor(minutes / MINUTES_IN_HOUR)
    return `${hours}h`
  }
  if (minutes < MINUTES_IN_WEEK) {
    const days = Math.floor(minutes / MINUTES_IN_DAY)
    return `${days}d`
  }

  const weeks = Math.floor(minutes / MINUTES_IN_WEEK)

  return `${weeks}w`
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
