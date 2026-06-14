import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../lib/auth'
import Logout from '../components/auth/Logout'
import TestPresence from '../components/testComp/TestPresence'
import { ThemeToggle } from '../components/testComp/theme-toggleBtn'
import { useUserStore } from '../store/user-store'

export default function Page() {
  return (
    <>
      <div className="bd_red  flex h-full flex-col">
        {/* #Main_grid */}
        <div className="grid grid-cols-[1fr_0.5fr] gap-3 p-2 h-full">
          {/* #left_elements */}
          <div className="bd_grn grid grid-rows-2 gap-3">
            <div className="bd_blu">priority queue</div>
            <div className="bd_blu">recen towrk</div>
          </div>

          {/* #right_elements */}
          <div className="bd_grn grid grid-rows-[1fr_0.8fr_1fr] gap-2">
            {/* #Workspace_overview */}
            <div className="bd_blu">Workspace_overview</div>
            {/* #Team_workload */}
            <div className="bd_blu">Team_workload</div>
            {/* #Recent_activity */}
            <div className="bd_blu">Recent_activity</div>
          </div>
        </div>
      </div>
    </>
  )
}
