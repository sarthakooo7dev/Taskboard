'use client'
import { signIn } from 'next-auth/react'
import React from 'react'

const GoogleSignInButton = () => {
  return (
    <button
      className="font-mono flex py-3 px-3 items-center justify-center gap-3 rounded-md  text-[15px]  tracking-wide text-gray-200 border border-lg_grey  transition hover:bg-lg_grey/10"
      onClick={() =>
        signIn('google', {
          callbackUrl: '/dashboard',
        })
      }
    >
      <img src="/images/google.webp" alt="google" className="h-6 w-6" />
      Continue with Google
    </button>
  )
}

export default GoogleSignInButton
