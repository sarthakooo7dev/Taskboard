'use client'

import { Loader2, PlayCircle } from 'lucide-react'
import React from 'react'
import { useDemoLogin } from './useDemoLogin'

const DemoButton2 = () => {
  const { login, loading } = useDemoLogin()
  return (
    <button
      className="flex items-center gap-2 rounded-xl px-2 md:px-3 py-2.5 text-sm font-medium text-gray-300 tracking-widest transition-all duration-300 hover:text-gray-200"
      onClick={login}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin text-purple-400" />
      ) : (
        <PlayCircle size={16} className="text-violet-400" />
      )}
      {loading ? (
        <span className="text-violet-400">Entering Demo workspace...</span>
      ) : (
        'Explore Demo'
      )}
    </button>
  )
}

export default DemoButton2
