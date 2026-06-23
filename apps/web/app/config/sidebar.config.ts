import { LayoutDashboard, Presentation, CheckSquare, Users } from 'lucide-react'
import { ROUTES } from '../lib/ui.routes'

export const SIDEBAR_CONFIG = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    items: [
      {
        id: 'overview',
        label: 'Overview',
        icon: LayoutDashboard,
        href: ROUTES.dashboard,
        info: 'Everything you need to stay in sync',
      },
      {
        id: 'boards',
        label: 'Workspace',
        icon: Presentation,
        href: ROUTES.boards,
        info: 'Browse and manage your boards',
      },
      // {
      //   id: 'tasks',
      //   label: 'Tasks',
      //   icon: CheckSquare,
      //   href: ROUTES.tasks,
      //   info: 'tasks',
      // },
      // {
      //   id: 'members',
      //   label: 'Members',
      //   icon: Users,
      //   href: ROUTES.members,
      //   info: 'members',
      // },
    ],
  },
]
