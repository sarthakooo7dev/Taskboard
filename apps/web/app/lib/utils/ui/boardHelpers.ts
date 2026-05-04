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
  Box,
  Cannabis,
  Origami,
  ShipWheel,
  Anchor,
  EggFried,
  Compass,
]

const COLORS = [
  'bg-blue-400/20 text-blue-400',
  'bg-red-400/20 text-red-300',
  'bg-green-400/20 text-green-400',
  'bg-lime-400/20 text-lime-400',
]

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
