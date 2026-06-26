import { ChevronsUpDown, Pen } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { ROUTES } from '../../../lib/ui.routes'
import { useUserStore } from '../../../store/user-store'
import UserCardSkeleton from '../loader-components/UserCardSkeleton'
import AddRoleModal from './AddRoleModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userAgent } from 'next/server'

const UserCard = () => {
  const [open, setOpen] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user, setUser } = useUserStore()

  const mutation = useMutation({
    mutationFn: async (role: string) => {
      const res = await fetch('/api/user/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })

      if (!res.ok) {
        throw new Error('Failed to update role')
      }

      return res.json()
    },

    onSuccess: (data) => {
      console.log('onsucess----' + data)
      setUser(data?.data)
      toast.success('Role updated !')
    },

    onError: () => {
      toast.error('Failed to update role.')
    },
  })

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (role: string) => {
    mutation.mutate(role)
    console.log(' role ------------- ' + role)
  }

  if (!user) {
    return <UserCardSkeleton />
  }

  return (
    <div
      ref={ref}
      className="relative border-t border-[rgb(50,49,54)] pt-3 mt-1"
    >
      {/* 🔽 Animated Dropdown */}
      <div
        className={`
          absolute bottom-full  w-full z-50
          transition-all duration-200 ease-out
          origin-bottom
          ${
            open
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
          }
        `}
      >
        <div className="bg-dk_grey mb-[-8px]  border border-dk_border rounded-md shadow-lg p-2">
          <button
            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-lg_grey/30 rounded-md"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Logout
          </button>
        </div>
      </div>

      {/* 👤 User Card */}
      <div className="flex items-center justify-between cursor-pointer p-[6px] border-2 border-dk_border rounded-md">
        <div className="bg-purple-950 rounded-md">
          <img className="w-9 h-9 rounded-md" src={user?.avatar} alt="image" />
        </div>

        <div className="flex-1 ml-2">
          <p className="text-sm w-[16ch] overflow-hidden whitespace-nowrap opacity-85">
            {user?.name}
          </p>
          {user?.role ? (
            <p className="text-xs w-[16ch] overflow-hidden whitespace-nowrap text-gray-400">
              {user?.role}
            </p>
          ) : (
            <p
              className="flex items-center w-[11ch] gap-1 text-xs text-gray-400 cursor-pointer "
              onClick={() => setOpenModal(true)}
            >
              <Pen size={12} /> Add role
            </p>
          )}
        </div>

        <div
          className="text-xs p-[3px] text-white/60"
          onClick={() => setOpen((prev) => !prev)}
        >
          <ChevronsUpDown size={16} />
        </div>
      </div>

      <AddRoleModal
        open={openModal}
        onOpenChange={setOpenModal}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default UserCard
