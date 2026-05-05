"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBoardModalStatus } from "@/app/store/board-store";
import { useUserStore } from "@/app/store/user-store";

export default function CreateBoardModal() {
    const { open, closeModal } = useBoardModalStatus();
    const { user } = useUserStore();
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");

    const queryClient = useQueryClient();
    const totalTasks = 0
    const blockedTasks = 0
    const inProgressTasks = 0
    const totalMembers = 1

    const createBoard = useMutation({
        mutationFn: async (data: { name: string; description: string }) => {
            const res = await fetch("/api/boards", {
                method: "POST",
                body: JSON.stringify(data),
            });
            return res.json();
        },

        onSuccess: (res) => {
            const b = res.data;
            console.log("cache onSuccess " + JSON.stringify(b))

            const newBoard = {
                title: b.name,
                boardId: b.id,
                role: "MANAGER",
                description: b.Description,
                totalTasks,
                blockedTasks,
                inProgressTasks,
                totalMembers,
                updatedAt: b.updatedAt,
                members: [{
                    id: user?.id,
                    name: user?.name,
                    avatar: user?.avatar
                }],

            };

            queryClient.setQueryData(["boards", "summary"], (old: any[]) => {
                if (!old) return [newBoard];
                return [newBoard, ...old];
            });
        },
    });

    const handleCreate = () => {
        if (!name.trim()) return;

        createBoard.mutate({ name, description: desc });

        setName("");
        setDesc("");
        closeModal();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-[320px] rounded-xl border border-white/10 bg-[#0f0f11] p-5">
                <h2 className="mb-4 text-sm text-white">Create Board</h2>

                <input
                    placeholder="Board name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-3 w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-white"
                />

                <textarea
                    placeholder="Description"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="mb-4 w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-white"
                />

                <div className="flex justify-end gap-2">
                    <button onClick={closeModal} className="text-gray-400">
                        Cancel
                    </button>

                    <button
                        onClick={handleCreate}
                        className="rounded bg-white/10 px-3 py-1.5 text-white"
                    >
                        {createBoard.isPending ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}