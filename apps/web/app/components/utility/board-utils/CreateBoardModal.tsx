"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBoardModalStatus } from "@/app/store/board-store";
import { useUserStore } from "@/app/store/user-store";
import {
    Zap,
    LoaderCircle,
    Sparkles,
    X,
    ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function CreateBoardModal() {
    const { open, closeModal } = useBoardModalStatus();
    const { user } = useUserStore();

    const [name, setName] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("")

    const queryClient = useQueryClient();

    const createBoard = useMutation({
        mutationFn: async (data: {
            name: string;
            description: string;
        }) => {
            const res = await fetch("/api/boards", {
                method: "POST",
                body: JSON.stringify(data),
            });
            const json = await res.json();

            if (!res.ok) {
                throw json;
            }
            return json;
        },

        onSuccess: (res) => {
            const b = res.data;

            const newBoard = {
                title: b.name,
                boardId: b.id,
                role: "MANAGER",
                description: b.Description,
                totalTasks: 0,
                blockedTasks: 0,
                inProgressTasks: 0,
                totalMembers: 1,
                updatedAt: b.updatedAt,

                members: [
                    {
                        id: user?.id,
                        name: user?.name,
                        avatar: user?.avatar,
                    },
                ],
            };

            queryClient.setQueryData(
                ["boards", "summary"],
                (old: any[] = []) => {
                    return [newBoard, ...old];
                }
            );

            setName("");
            setDesc("");

            closeModal();

            toast.success("Board created successfully !");
        },


        onError: (error: any) => {
            closeModal();
            const code = error?.error?.code;

            switch (code) {
                case "UNAUTHORIZED":
                    setErrorMessage("Please login again");
                    break;
                case "INTERNAL_ERROR":
                    setErrorMessage("Something went wrong.Please try again");
                    break;
                default:
                    setErrorMessage("Unexpected error");
            }
            toast.error(errorMessage);
        },
    });

    const handleCreate = () => {
        if (!name.trim()) return;

        createBoard.mutate({
            name,
            description: desc,
        });
    };

    const handleCancel = () => {
        closeModal();
        setName("")
        setDesc("")
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div
                className=" relative mx-4  w-[440px] max-w-[92vw]
                    max-h-[90vh] overflow-y-auto  rounded-3xl
                    border border-purple-500/15  bg-[#09090B]
                    shadow-2xl shadow-black/60 " >
                {/* TOP GLOW */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

                {/* CLOSE */}
                {!createBoard.isPending && (
                    <button
                        onClick={handleCancel}
                        className=" absolute right-4 top-4 z-20
                            text-gray-400 transition
                            hover:text-white "  >
                        <X size={20} />
                    </button>
                )}

                {/* LOADING STATE */}
                {createBoard.isPending ? (
                    <div className="flex min-h-[400px]  flex-col items-center justify-center px-6 py-5 text-center">
                        {/* ICON */}
                        <div
                            className="relative mb-2 flex h-16 w-16
                                items-center justify-center
                                rounded-2xl border border-purple-500/20
                                bg-purple-500/10 " >
                            <Zap
                                size={24}
                                className="relative z-10 text-purple-400"
                            />
                        </div>

                        {/* TITLE */}
                        <h2 className="mb-1 text-xl font-semibold text-gray-200">
                            Creating board...
                        </h2>

                        <p className="mb-8 max-w-[260px] text-sm leading-6 text-zinc-400">
                            This may take few seconds
                        </p>

                        {/* SPINNER */}
                        <LoaderCircle
                            size={52}
                            className="mt-8 animate-spin text-purple-400"
                        />
                    </div>
                ) : (
                    <>
                        {/* HEADER */}
                        <div className="flex  px-6 pt-4 ">
                            <div className="flex items-center ">
                                <div
                                    className="flex h-12 w-12 items-center justify-center rounded-2xl
                                    border border-purple-500/20
                                    bg-purple-500/10 "
                                >
                                    <Zap
                                        size={24}
                                        className="text-purple-400"
                                    />

                                </div>
                                <div className=" pl-2 ">
                                    <h2 className="text-lg font-semibold tracking-wide text-gray-300">
                                        Create Board
                                    </h2>
                                    <p className="text-xs  text-zinc-400">
                                        Set up a new Board
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* FORM */}
                        <div className="mt-2 border-t border-white/5 px-6 py-5">
                            {/* BOARD NAME */}
                            <div className="mb-5">
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-300 tracking-wider">
                                        Board name
                                    </label>

                                    <span className="text-[11px] text-zinc-500">
                                        {name.length}/50
                                    </span>
                                </div>

                                <input
                                    maxLength={50}
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Enter board name"
                                    className="h-11 w-full rounded-md
                                        border border-white/10
                                        bg-white/[0.03]
                                        px-4 text-sm text-gray-200
                                        outline-none transition-all
                                        placeholder:text-zinc-500
                                        focus:border-purple-900/70            
                                    "
                                />

                                <p className="ml-1 mt-1 text-[11px] text-zinc-500">
                                    Give your board a unique and clear name.
                                </p>
                            </div>

                            {/* DESCRIPTION */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-sm tracking-wider font-medium text-gray-300">
                                        Description
                                    </label>

                                    <span className="text-[11px] text-zinc-500">
                                        {desc.length}/200
                                    </span>
                                </div>

                                <textarea
                                    maxLength={200}
                                    value={desc}
                                    onChange={(e) =>
                                        setDesc(e.target.value)
                                    }
                                    placeholder="Add a short description about this board..."
                                    className="
                                        min-h-[70px] w-full resize-none
                                        rounded-md border border-white/10
                                        bg-white/[0.03]
                                        px-4 py-3 text-sm text-gray-200                                    outline-none transition-all
                                        placeholder:text-zinc-500                            focus:border-purple-900/70 "
                                />

                                <p className="ml-1 text-[11px] text-zinc-500">
                                    Help your team understand this Board.
                                </p>
                            </div>

                            {/* FOOTER */}
                            <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-4">
                                <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                                    <Sparkles
                                        size={12}
                                        className="text-purple-400"
                                    />

                                    Ready instantly
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleCancel}
                                        className="h-10 rounded-md
                                            border border-white/10
                                            px-4 text-sm text-gray-300
                                            transition-all
                                            hover:bg-lg_grey/40
                                           tracking-wider " >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={handleCreate}
                                        disabled={(!name.trim() || !desc.trim())}
                                        className="
                                            flex h-10 items-center gap-2
                                            rounded-md tracking-wider
                                            bg-purple-700/65
                                            px-4 text-sm font-medium text-gray-100
                                            transition-all
                                            disabled:cursor-not-allowed
                                            disabled:opacity-40" > Create
                                        <ArrowRight size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )

                }
            </div>
        </div>
    );
}


