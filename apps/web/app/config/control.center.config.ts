import { ShieldQuestionMark, Settings } from 'lucide-react'
import { ROUTES } from '../lib/ui.routes'

export const CONTROL_CENTER_CONFIG = [
  {
    id: 'ControlCenter',
    title: 'Control-Center',
    items: [
      {
        id: 'helpCenter',
        label: 'Help Center',
        icon: ShieldQuestionMark,
        href: ROUTES.helpCenter,
      },
      {
        id: 'Settings',
        label: 'Settings',
        icon: Settings,
        href: ROUTES.settings,
      },
    ],
  },
]
