import React from 'react'
import { CONTROL_CENTER_CONFIG } from '../../../config/control.center.config'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideDivide } from 'lucide-react'
import { toast } from 'sonner'

const ControlCenter = () => {
  const path = usePathname()
  const sidebarItems = CONTROL_CENTER_CONFIG[0]?.items

  const handleClick = () => {
    toast.info('We’re working on this feature. Stay tuned!')
  }

  return (
    <div className=" ">
      <div className="flex flex-col gap-1">
        {sidebarItems?.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              onClick={handleClick}
              className={`flex items-center gap-3 px-3 py-2 text-sm text-gray-600 tracking-[1px] cursor-pointer 
                            ${
                              path === item.href
                                ? 'bg-lg_grey text-white/80 '
                                : ' hover:bg-lg_grey/30'
                            } rounded-md`}
            >
              <Icon size={16} />
              {item.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ControlCenter
