import { getServerSession } from 'next-auth'
import { json } from 'stream/consumers'
import { authOptions } from './lib/auth'
import AuthModal from './components/auth/authModal'
import LandingPage from './components/LandingPage/LandingPage'

const page = async () => {
  return (
    <div className="bd_grn flex flex-col min-h-screen">
      <LandingPage />
    </div>
  )
}

export default page
