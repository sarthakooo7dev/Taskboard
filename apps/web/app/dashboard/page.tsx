'use client'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect } from 'react'
import {
  DashboardData,
  DashboardTaskItem,
  quickInsightsData,
  TeamWorkloadItem,
  WorkspaceOverviewItem,
} from '../types/general.types'
import Workload from '../components/utility/dashboard-utils/Workload'
import WorkspaceOverview from '../components/utility/dashboard-utils/WorkspaceOverview'
import ActivityFeed from '../components/utility/dashboard-utils/ActivityFeed'
import { useDashboardStore } from '../store/dash-store'
import RecentTasks from '../components/utility/dashboard-utils/QuickInsights'
import MyTasks from '../components/utility/dashboard-utils/MyTasks'
import FocusMetrics from '../components/utility/dashboard-utils/QuickInsights'
import QuickInsights from '../components/utility/dashboard-utils/QuickInsights'

export default function Page() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard`)

      if (!res.ok) {
        throw new Error('Failed to fetch data for dashboard')
      }
      return res.json()
    },
    staleTime: 10 * 1000,
    // refetchOnMount: false, //
  })

  const dashboardData: DashboardData = data?.data
  const workloadData: TeamWorkloadItem[] = dashboardData?.teamWorkload
  const workspaceData: WorkspaceOverviewItem[] =
    dashboardData?.workspaceOverview
  const myTasksData: DashboardTaskItem[] = dashboardData?.userTasks
  const quickInsights: quickInsightsData = dashboardData?.quickInsights

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load dashboard. Please try refreshing again.')
    }
  }, [isError])

  return (
    <>
      <div className="  flex h-full flex-col">
        {/* #Main_grid */}
        <div className="grid grid-cols-[1fr_0.5fr] gap-3 p-2 h-full">
          {/* #left_elements */}
          <div className=" grid grid-rows-[0.7fr_1fr] gap-2 min-h-0">
            <div className=" grid grid-cols-2 gap-3">
              {/* #recent_work */}
              <div className=" bg-lg_grey/30 rounded-lg">
                <QuickInsights
                  quickInsights={quickInsights}
                  isLoading={isLoading}
                />
              </div>

              {/* #Team_workload */}
              <div className=" bg-lg_grey/30 rounded-lg">
                <Workload
                  workloadData={workloadData ?? []}
                  isLoading={isLoading}
                />
              </div>
            </div>
            {/* #My_tasks */}
            <div className=" bg-lg_grey/30 rounded-lg min-h-0">
              <MyTasks myTasksData={myTasksData ?? []} isLoading={isLoading} />
            </div>
          </div>

          {/* #right_elements */}
          <div className=" grid grid-rows-[0.7fr_1fr] gap-2 ">
            {/* #Workspace_overview */}
            <div className="bg-lg_grey/30 rounded-lg">
              <WorkspaceOverview
                workspaceData={workspaceData ?? []}
                isLoading={isLoading}
              />{' '}
            </div>

            {/* #Recent_activity */}
            <div className="bg-lg_grey/30 rounded-lg">
              <ActivityFeed />{' '}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
