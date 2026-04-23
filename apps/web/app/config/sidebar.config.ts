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
      },
      {
        id: 'boards',
        label: 'Boards',
        icon: Presentation,
        href: ROUTES.boards,
      },
      {
        id: 'tasks',
        label: 'Tasks',
        icon: CheckSquare,
        href: ROUTES.tasks,
      },
      {
        id: 'members',
        label: 'Members',
        icon: Users,
        href: ROUTES.members,
      },
    ],
  },
]
