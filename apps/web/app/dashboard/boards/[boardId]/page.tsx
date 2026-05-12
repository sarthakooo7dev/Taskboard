"use client"
import TaskMainComp from '@/app/components/utility/board-utils/TaskMainComp';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react'

const page = () => {

    return <>
        <div className='m-2 flex h-[96%] flex-col  bd_red '>
            <TaskMainComp />
        </div>
    </>;

}

export default page
