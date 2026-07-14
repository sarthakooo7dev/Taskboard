'use client'
import { Loader2, PlayCircle } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { useDemoLogin } from './useDemoLogin'

const DemoButton = () => {
  const { login, loading } = useDemoLogin()
  return (
    <div
      className=" flex py-2 px-3 rounded-md items-center justify-center gap-3 text-violet-400  tracking-wide border border-purple-900 font-mono transition hover:bg-lg_grey/10 cursor-pointer"
      onClick={login}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <PlayCircle size={16} />
      )}
      <span className="text-base font-medium">
        {' '}
        {loading ? <>Entering Demo workspace...</> : 'Explore Demo'}
      </span>{' '}
    </div>
  )
}

export default DemoButton
