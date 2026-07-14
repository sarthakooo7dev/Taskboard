import React from 'react'
import Navbar from './Navbar'
import { Bubbles, Flame, Mail, PlayCircle, Zap } from 'lucide-react'
import AuthModal from '../auth/authModal'
import { signIn } from 'next-auth/react'
import GoogleSignInButton from './GoogleSignInButton'
import DemoButton from './DemoButton'

const LandingPage = () => {
  return (
    <div className=" flex flex-col flex-1 hero_bg">
      {/*# Navbar */}
      <div className="">
        <Navbar />
      </div>
      {/* #Main_content */}
      <div className="grid  grid-cols-1 lg:grid-cols-[55%_45%] xl:grid-cols-[42%_58%]  min-h-0 flex-1">
        {/* #Left_content */}
        <div className=" h-full  ">
          <div className="flex h-full flex-col  md:items-center lg:items-start justify-center px-3 lg:px-8 xl:px-10  pb-2">
            {/* Badge */}
            <div className="mb-2 md:mb-3 ">
              <div className="inline-flex items-center justify-center gap-1 rounded-full border border-white/10 bg-white/[0.02] px-2 py-1">
                <Zap className=" text-violet-400" size={13} />
                <span className="text-xs  text-gray-400 tracking-wider font-sans mt-[-4px]">
                  Crafted for modern teams
                </span>
              </div>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-4xl md:text-5xl  font-bold leading-[1.05]  text-gray-100/90">
                Plan with ease.
              </h1>

              <h1 className="mt-2 text-4xl md:text-5xl font-bold leading-[1.05] text-violet-400 ">
                Build without limits.
              </h1>
            </div>

            {/* Description */}
            <p className="mt-2  text-lg leading-8 text-gray-400 font-sans tracking-wide">
              Plan, track, and collaborate with your team in one focused
              workspace.
            </p>

            {/* Buttons */}
            <div className="mt-4 flex  gap-4 flex-col md:flex-row ">
              <GoogleSignInButton />

              <button className="flex py-3 px-3 items-center justify-center gap-3 rounded-md tracking-wide border border-lg_grey  text-[15px]  text-gray-300 font-mono transition hover:bg-lg_grey/10">
                <Mail className="h-5 w-5 text-zinc-300" />
                Continue with Email
              </button>
            </div>

            {/* Divider */}
            <div className="my-2 flex items-center gap-5 md:w-[70%]  lg:w-[100%]">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-sm text-zinc-500">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Demo */}
            <div className=" flex flex-col gap-3 items-center md:items-center lg:items-center justify-center  w-full">
              <DemoButton />
              <div className="tracking-widest text-gray-400 text-xs pl-2 font-mono flex items-center justify-center  gap-2 ">
                <Flame size={17} className="text-orange-400 mt-[-2px]" />{' '}
                Everything unlocked. No sign-up.
              </div>
            </div>
          </div>
        </div>

        {/* #right_content */}
        <div className=" h-full pt-1  hidden lg:block ">
          {/* Right Content */}
          <div className="relative flex h-full items-start justify-center overflow-hidden pr-6 ">
            <img
              src="/images/dash4.svg"
              alt="Dashboard"
              className=" border border-violet-400/10  rounded-md object-contain [transform:perspective(1800px)_rotateY(-11deg)_rotateX(7deg)] [transform-origin:right_center]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
