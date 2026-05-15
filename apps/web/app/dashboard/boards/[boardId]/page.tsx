"use client"
import TaskMainComp from '@/app/components/utility/board-utils/TaskMainComp';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react'

const page = () => {

    return <>
        <div className=' flex h-full flex-col   '>
            <TaskMainComp />
        </div>
    </>;

}

export default page
