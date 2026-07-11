import React from 'react'
import Navbar from './Navbar'
import { Bubbles, Flame, Mail, PlayCircle, Zap } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="bd_red flex flex-col flex-1 hero_bg">
      {/*# Navbar */}
      <div className="bd_blu">
        <Navbar />
      </div>
      {/* #Main_content */}
      <div className="grid  grid-cols-1 md:grid-cols-[42%_58%] min-h-0 flex-1">
        {/* #Left_content */}
        <div className="bd_grn h-full">
          <div className="flex h-full flex-col justify-center px-3 lg:px-8 xl:px-10">
            {/* Badge */}
            <div className="mb-3">
              <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1">
                <Zap className="h-4 w-4 text-violet-400" />
                <span className="text-sm text-gray-400 tracking-wider font-sans mt-[-3px]">
                  Crafted for modern teams
                </span>
              </div>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-5xl font-bold leading-[1.05]  text-gray-100/90">
                Plan with ease.
              </h1>

              <h1 className="mt-2 text-5xl font-bold leading-[1.05] text-violet-400 ">
                Build without limits.
              </h1>
            </div>

            {/* Description */}
            <p className="mt-2  text-lg leading-8 text-gray-400 font-sans tracking-wide">
              Plan, track, and collaborate with your team in one focused
              workspace.
            </p>

            {/* Buttons */}
            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <button className="font-mono flex py-3 px-3 items-center justify-center gap-3 rounded-md  text-[15px]  tracking-wide text-gray-200 border border-lg_grey  transition hover:bg-lg_grey/10">
                <img
                  src="/images/google.webp"
                  alt="google"
                  className="h-6 w-6"
                />
                Continue with Google
              </button>

              <button className="flex py-3 px-3 items-center justify-center gap-3 rounded-md tracking-wide border border-lg_grey  text-[15px]  text-gray-300 font-mono transition hover:bg-lg_grey/10">
                <Mail className="h-5 w-5 text-zinc-300" />
                Continue with Email
              </button>
            </div>

            {/* Divider */}
            <div className="my-4 flex items-center gap-5">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-sm text-zinc-500">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Demo */}
            <div className=" flex flex-col gap-3 items-center justify-end">
              <div className=" flex py-2 px-3 rounded-md items-center gap-3 text-violet-400  tracking-wide border border-purple-900 font-mono transition hover:bg-lg_grey/10 cursor-pointer">
                <PlayCircle size={16} />
                <span className="text-base font-medium">Explore Demo</span>{' '}
              </div>
              <div className="tracking-widest text-gray-400 text-xs pl-2 font-mono flex items-center gap-2">
                <Flame size={17} className="text-orange-400 mt-[-2px]" />{' '}
                Everything unlocked. No sign-up.
              </div>
            </div>
          </div>
        </div>
        <div className="bd_grn h-full">right</div>
      </div>
    </div>
  )
}

export default LandingPage
