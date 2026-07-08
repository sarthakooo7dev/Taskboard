'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const LoginForm = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)
    console.log(res)

    if (!res?.ok) {
      alert('Invalid email or password')
      return
    }

    // ✅ logged in successfully
    alert('Login successful')
    router.push('/dashboard')
  }

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <button
        onClick={() =>
          signIn('google', {
            callbackUrl: '/dashboard',
          })
        }
      >
        Continue with Google
      </button>
    </div>
  )
}

export default LoginForm
