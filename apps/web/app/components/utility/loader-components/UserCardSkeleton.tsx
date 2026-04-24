import React from 'react'

const UserCardSkeleton = () => {
    return (
        <div className="relative border-t border-[rgb(50,49,54)] pt-3 mt-1">

            {/* 👤 User Card */}
            <div className="flex items-center justify-between cursor-pointer p-[6px] border-2 border-dk_border rounded-md">

                {/* Avatar */}
                <div className="bg-purple-950 rounded-md">
                    <div className="w-9 h-9 rounded-md bg-gray-700 animate-pulse" />
                </div>

                {/* Text */}
                <div className="flex-1 ml-2">

                    {/* Name */}
                    <div className="h-[14px] w-[16ch] bg-gray-700 rounded animate-pulse mb-[2px]" />

                    {/* Role / Add role */}
                    <div className="h-[12px] w-[11ch] bg-gray-700 rounded animate-pulse" />

                </div>

                {/* Icon */}
                <div className="text-xs p-[3px] text-white/60">
                </div>

            </div>
        </div>
    )
}

export default UserCardSkeleton
