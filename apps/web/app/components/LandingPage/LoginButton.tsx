'use client'

import { Mail } from 'lucide-react'
import React, { useState } from 'react'
import AuthModal from '../auth/authModal'

const LoginButton = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="flex py-3 px-3 items-center justify-center gap-3 rounded-md tracking-wide border border-lg_grey  text-[15px]  text-gray-300 font-mono transition hover:bg-lg_grey/10"
        onClick={() => setOpen(true)}
      >
        <Mail className="h-5 w-5 text-zinc-300" />
        Continue with Email
      </button>

      <AuthModal open={open} onOpenChange={setOpen} />
    </>
  )
}

export default LoginButton
