import { PlayCircle } from 'lucide-react'
import Image from 'next/image'
import DemoButton2 from './DemoButton2'

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between  px-8  md:px-12 py-4 md:py-6 ">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Image
          src="/images/logo2.png"
          alt="Klyro Logo"
          width={34}
          height={34}
          className="p-1 bg-purple-700/30 rounded-md "
        />

        <h1 className="text-lg font-semibold tracking-[0.25em] text-gray-300">
          KLYRO
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 font-mono">
        <DemoButton2 />

        <button
          className="hidden sm:block rounded-sm border border-lg_grey  px-8 py-1 text-sm font-medium tracking-widest  text-gray-300
         hover:bg-lg_grey/30 hover:text-gray-200"
        >
          Log In
        </button>
      </div>
    </nav>
  )
}

export default Navbar
