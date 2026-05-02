import BoardCard from '@/app/components/utility/board-utils/BoardCard'
import React from 'react'

const page = () => {

    const mem = [
        {
            id: "1",
            name: "Sanjay",
            image: "/avatars/avatar1.png",
        },
        {
            id: "2",
            name: "Rahul",
            image: "/avatars/avatar2.png",
        },
        {
            id: "3",
            name: "Aman",
            image: "/avatars/avatar3.png",
        },
        {
            id: "4",
            name: "Priya",
            image: "/avatars/avatar4.png",
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-3 ">
            <BoardCard
                title="Product Roadmap"
                boardId="c58596f3-5c39-49e1-bdb6-fe4cc05470b8"
                role="MANAGER"
                description="Planning and tracking "
                totalTasks={12}
                blockedTasks={5}
                inProgress={3}
                updatedAt="2h ago"
                members={mem}
            />

            <BoardCard
                title="Design & Development"
                boardId="aqqqqqqqqqqqqqq ewredgvfdfg"
                role="MANAGER"
                description="Coordinating design and development tasks to ensure smooth delivery"
                totalTasks={12}
                blockedTasks={0}
                inProgress={3}
                updatedAt="2h ago"
                members={mem}
            />
        </div>
    )
}

export default page