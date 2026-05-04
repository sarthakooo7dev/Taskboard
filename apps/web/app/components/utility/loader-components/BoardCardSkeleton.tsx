"use client";

const BoardCardSkeleton = () => {
    return (
        <div className="p-3 rounded-xl bg-lg_grey/30 border border-dk_border animate-pulse">

            {/* Top Row */}
            <div className="flex items-center gap-2 p-1">
                <div className="w-12 h-8 rounded-lg bg-gray-700/50" />
                <div className="h-4 w-2/3 rounded bg-gray-700/50" />
            </div>

            {/* State + Role */}
            <div className="mt-1 flex items-center justify-between">
                <div className="h-3 w-24 rounded bg-gray-700/40" />
                <div className="h-5 w-14 rounded bg-gray-700/40" />
            </div>

            {/* Description (IMPORTANT FIX) */}
            <div className="mt-2 min-h-[2rem] space-y-1">
                <div className="h-3 w-full rounded bg-gray-700/40" />
                <div className="h-3 w-4/5 rounded bg-gray-700/40" />
            </div>

            {/* Divider */}
            <div className="mt-3 border-t border-dk_border" />

            {/* Stats */}
            <div className="mt-3 flex gap-4">
                <div className="h-3 w-20 rounded bg-gray-700/40" />
                <div className="h-3 w-24 rounded bg-gray-700/40" />
            </div>

            {/* Bottom */}
            <div className="mt-4 flex items-center justify-between">

                {/* Avatars */}
                <div className="flex -space-x-2.5">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="w-7 h-7 rounded-full bg-gray-700 border border-lg_grey/30"
                        />
                    ))}
                </div>

                {/* Updated */}
                <div className="flex items-center gap-2">
                    <div className="h-3 w-20 rounded bg-gray-700/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                </div>
            </div>
        </div>
    );
};

export default BoardCardSkeleton;