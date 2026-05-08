"use client"
import TaskTable, { TaskItem } from '@/app/components/utility/board-utils/TaskTable';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react'

const page = () => {

    const params = useParams();
    const title = useSearchParams().get("title");

    console.log(JSON.stringify(params))
    const tasks: TaskItem[] = [
        {
            id: "1",

            title: "Design landing page",

            description:
                "Create a modern and conversion focused landing page",

            estimate: "5h",

            comments: 3,

            status: "IN_PROGRESS",

            priority: "HIGH",

            assignee: {
                id: "1",
                name: "Rahul Sharma",
                avatar: "/avatars/avatar1.png",
            },
        },
    ];

    return <>
        <div className='m-3 h-[82vh] '>
            <TaskTable tasks={tasks} />
        </div>
    </>;

}

export default page
