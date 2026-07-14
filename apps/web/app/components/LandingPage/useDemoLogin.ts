'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function useDemoLogin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const login = async () => {
    setLoading(true)

    const res = await signIn('credentials', {
      demo: 'true',
      redirect: false,
    })

    if (res?.ok) {
      router.push('/dashboard')
      return
    }

    setLoading(false)
    toast.error('Unable to launch demo. Try Google Sign-In instead.')
  }

  return { login, loading }
}
