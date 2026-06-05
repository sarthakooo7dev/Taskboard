import { formatCommentTime } from '@/app/lib/utils/ui/boardHelpers';
import { useUserStore } from '@/app/store/user-store';
import { CommentTabProps, TaskComment } from '@/app/types/general.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LineDotRightHorizontal, Loader2, Minus, SendHorizontal } from 'lucide-react';
import Image from 'next/image'
import { userAgent } from 'next/server';
import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'sonner';

const CommentsTab = ({ taskId, boardId, setCount, isEditMode }: CommentTabProps) => {

    const User = useUserStore((s) => s.user);
    const queryClient = useQueryClient()
    const [mentionedIds, setMentionedIds] = useState<string[]>([]);
    const [commentMsg, setCommentMsg] = useState<string>("")
    if (!User) return

    const { data, isLoading, isFetching, } = useQuery({
        queryKey: ["task-comments", boardId, taskId],
        queryFn: async () => {
            const res = await fetch(`/api/boards/${boardId}/tasks/${taskId}/comments`);

            if (!res.ok) {
                toast.error("Something went wrong loading comments. Try refresh");
                throw new Error(
                    "Failed to fetch comments for the task",
                );
            }
            return res.json();
        },

    });


    const comments = data;

    useEffect(() => {
        setCount(comments?.length ?? 0)
    }, [data])

    const createCommentMutation = useMutation({
        mutationFn: async ({ message, mentionedIds, }: { message: string; mentionedIds: string[] }) => {
            const res = await fetch(`/api/boards/${boardId}/tasks/${taskId}/comments`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message, mentionedUserIds: mentionedIds ?? [] }),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to create comment");
            }

            return res.json();
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["task-comments", boardId, taskId],
            });
            setCommentMsg("");
        },

        onError: () => {
            toast.error("Something went wrong while adding comment.Try refresh")
        }
    });

    const handleComment = () => {
        const message = commentMsg.trim();
        if (!message) {
            return
        }
        createCommentMutation.mutate({ message, mentionedIds });
    }

    return (

        <div className='min-h-0 flex flex-col justify-between h-full'>

            <div className='min-h-0 flex-1 flex flex-col  overflow-y-auto minimal-scrollbar'>

                {
                    (isLoading) && <div className='flex-1 flex items-center justify-center '>
                        <Loader2 size={16} className="animate-spin text-purple-500" />
                    </div>
                }

                {!isLoading && comments?.length === 0 && (
                    <div className="flex flex-1 flex-col items-center justify-center">
                        <p className="text-sm text-gray-400">
                            No comments
                        </p>

                        <p className="mt-1 text-[12px] text-gray-500">
                            Be the first to comment
                        </p>
                    </div>
                )}

                {comments?.map((val: TaskComment) => {

                    return (

                        <div key={val.id} className=' flex p-[3px] gap-2 '>
                            <div className=' flex items-center justify-center shrink-0'>
                                <Image
                                    src={val.user.avatar}
                                    alt={val.user.name}
                                    width={33}
                                    height={23}
                                    className="rounded-lg p-1" />

                            </div>

                            <div className='flex-1'>
                                <div className='flex items-center gap-2 justify-between pr-2'> <p className='text-[14px] text-gray-300 tracking-wider'>{val.user.name}</p> <span className='text-[11px]'>{formatCommentTime(val.createdAt)}</span>
                                </div>
                                <p className='line-clamp-2 text-sm'> {val.message}</p>
                            </div>
                        </div>
                    )
                })}


            </div>

            {/* #input area */}
            {!isEditMode && <div className='h-10 flex justify-between gap-1 p-1 px-1 '>


                <Image
                    src={User.avatar}
                    alt={User.name}
                    width={34}
                    height={23}
                    className="rounded-md p-0.5" />


                <input type="text" className='w-full bg-transparent border border-lg_grey outline-none focus:outline-none focus:ring-0 text-[15px] px-2 rounded-md placeholder:text-[12px] tracking-wider ' placeholder='Write a comment' onChange={(e) => setCommentMsg(e.target.value)} value={commentMsg} />

                <div className='w-9 bg-lg_grey/70 shrink-0 p-1 rounded-sm flex items-center justify-center cursor-pointer ' >
                    {createCommentMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <SendHorizontal size={23} className='text-purple-800 hover:text-purple-700' onClick={handleComment} />}

                </div>
            </div>}


        </div>
    )
}

export default CommentsTab