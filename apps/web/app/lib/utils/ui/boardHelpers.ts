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
