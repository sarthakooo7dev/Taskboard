'use client'

import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Info, PlusIcon, UserKey } from 'lucide-react'
import { suggestedRoles } from '@/app/lib/utils/ui/boardHelpers'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (role: string) => void
}

const AddRoleModal = ({ open, onOpenChange, onSubmit }: Props) => {
  const [selectedRole, setSelectedRole] = useState<string>('Developer')
  const [customRole, setCustomRole] = useState<string>('')
  const [showInput, setShowInput] = useState<boolean>(false)

  const finalRole = customRole.trim() || selectedRole
  const resetState = () => {
    setSelectedRole('Developer')
    setCustomRole('')
    setShowInput(false)
  }
  const handleDone = () => {
    onSubmit(finalRole)
    onOpenChange(false)
    resetState()
  }

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetState()
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-dk_grey text-gray-300/90 border border-lg_grey p-2 px-3 pt-4 ">
        <DialogHeader className="px-3 pb-4 border-b border-lg_grey ">
          {/* TOP GLOW */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          <div className="flex  items-center  ">
            <div className="border border-purple-500/20 bg-purple-500/10  rounded-md mr-2 flex items-center p-2.5  ">
              <UserKey className=" text-purple-500" size={22} />
            </div>

            <div>
              <DialogTitle className=" text-lg font-semibold leading-5 mt-1">
                Add Role
              </DialogTitle>

              <DialogDescription className=" text-[12px] text-gray-400 ">
                Select a role or add a custom one.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className=" px-4 py-1  ">
          <div>
            <p className="mb-6 flex items-center justify-between text-xs font-medium  tracking-wider text-gray-500">
              <span className="uppercase">Suggested Roles</span>
              <span
                className="tracking-wider text-purple-600 flex items-center gap-1 cursor-pointer"
                onClick={() => setShowInput(true)}
              >
                <PlusIcon size={14} /> Add custom
              </span>
            </p>

            <div className="grid grid-cols-3 gap-3  p-1">
              {suggestedRoles.map((role) => {
                const Icon = role.icon
                const active = selectedRole === role.id

                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role.id)
                      setCustomRole('')
                    }}
                    className={`flex items-center justify-center gap-2 rounded-md border bg-white/[0.03] p-1 focus:outline-none transition-all ${
                      active
                        ? 'border-violet-800  '
                        : 'border-white/10 hover:bg-white/[0.05]'
                    }`}
                  >
                    <Icon size={15} className={`${role.color}`} />

                    <span className="text-[13px] tracking-wide">
                      {role.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <div
              className={`relative overflow-hidden transition-all duration-500 ease-in-out  ${
                showInput ? 'h-8 opacity-100 mt-4' : 'h-0 opacity-0 mt-0'
              }`}
            >
              <UserKey
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600"
              />
              <input
                type="text"
                onChange={(e) => setCustomRole(e.target.value)}
                maxLength={15}
                placeholder="Enter custom role..."
                className="h-8 pl-10 w-full rounded-md border border-white/10 bg-white/[0.03] px-4 text-gray-300 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/15 focus:outline-none"
              />
            </div>
            {showInput && (
              <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500 pl-2 tracking-wider">
                <Info size={12} className="text-red-600" />
                <span>Maximum 15 characters allowed.</span>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => handleClose(false)}
              className="tracking-wider px-5 text-gray-300 border border-lg_grey"
            >
              Cancel
            </Button>

            <Button
              variant="default"
              onClick={handleDone}
              className=" bg-purple-500/60 text-gray-100 tracking-wider px-5"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddRoleModal
