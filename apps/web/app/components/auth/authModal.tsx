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
import { Input } from '@/components/ui/input'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'
import LoginForm from './LoginForm'
import { getRandomAvatar } from '@/app/lib/utils/ui/getRandomAvatar'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (!res?.ok) {
        toast.error('Invalid email or password.')
        return
      }

      toast.success('Login successfull !')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    if (mode === 'signup' && !fullName.trim()) {
      toast.error('Please enter your full name.')
      return false
    }

    if (!email.trim()) {
      toast.error('Please enter your email.')
      return false
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email.')
      return false
    }

    if (!password) {
      toast.error('Please enter your password.')
      return false
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return false
    }

    return true
  }

  const handleSignup = async () => {
    setLoading(true)

    try {
      const avatar = getRandomAvatar()
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, password, avatar }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || 'Signup failed !')
        return
      }

      toast.success(data.message || 'Account created successfully')
      setMode('signin')
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAuthClick = () => {
    if (!validateForm()) return
    if (mode === 'signin') {
      handleLogin()
    } else {
      handleSignup()
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl border border-white/10 bg-[#0D0E15]/95 p-7 shadow-2xl backdrop-blur-xl">
        {/* subtle top glow */}
        <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />

        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-gray-100">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-400 tracking-wider ">
            {mode === 'signin'
              ? 'Continue where you left off.'
              : 'Create your KLYRO workspace in seconds.'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          {mode === 'signup' && (
            <Input
              placeholder="Full name"
              maxLength={30}
              className="h-11 rounded-md border-white/10 bg-white/[0.03] focus-visible:ring-1 focus-visible:ring-violet-700 text-gray-100"
              onChange={(e) => setFullName(e.target.value)}
            />
          )}

          <Input
            type="email"
            placeholder="Email"
            className="h-11 rounded-md border-white/10 bg-white/[0.03] focus-visible:ring-1 focus-visible:ring-violet-700 text-gray-100"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            className="h-11 rounded-md border-white/10 bg-white/[0.03] focus-visible:ring-1 focus-visible:ring-violet-700 text-gray-100"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* {mode === 'signin' && (
            <button className="text-xs text-zinc-500 transition hover:text-zinc-300">
              Forgot password?
            </button>
          )} */}

          <Button
            className="mt-2 h-11 w-full rounded-xl bg-violet-800 text-gray-100 tracking-wider transition hover:bg-violet-700/90"
            onClick={handleAuthClick}
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : mode === 'signin' ? (
              'Continue'
            ) : (
              'Create account'
            )}
          </Button>
        </div>

        <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <button
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="text-center text-sm text-gray-400 transition tracking-wider"
        >
          {mode === 'signin' ? (
            <>
              Don't have an account ? {'    '}
              <span className="font-medium text-violet-500 hover:text-violet-400 pl-1">
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span className="font-medium text-violet-400 hover:text-violet-400 pl-1">
                Sign in
              </span>
            </>
          )}
        </button>
      </DialogContent>
    </Dialog>
  )
}
