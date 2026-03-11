"use client"

import { useState } from "react"
import { io } from "socket.io-client"

const socket = io("http://localhost:4000")

export default function TestPresence({
    userId
}: {
    userId: string
}) {

    const [boardId, setBoardId] = useState("")
    const [users, setUsers] = useState<string[]>([])
    const [members, setMembers] = useState<Record<string, string>>({})

    async function joinBoard() {

        if (!boardId) return

        // fetch board members
        const res = await fetch(`/api/boards/${boardId}/members`)
        const resData = await res.json()

        const map: Record<string, string> = {}

        for (const member of resData.data) {
            map[member.user.id] = member.user.name
        }

        setMembers(map)

        socket.emit("JOIN_BOARD", {
            boardId,
            userId
        })

        socket.on("PRESENCE_UPDATE", (users: string[]) => {
            setUsers(users)
        })
    }

    return (
        <div style={{ marginTop: 40 }}>

            <h3>Realtime Presence Test</h3>

            <input
                placeholder="Enter Board ID"
                value={boardId}
                onChange={(e) => setBoardId(e.target.value)}
                style={{ border: "1px solid gray", padding: 6 }}
            />

            <button
                onClick={joinBoard}
                style={{ marginLeft: 10 }}
            >
                Join Board
            </button>

            <h4 style={{ marginTop: 20 }}>Users on board</h4>

            {users.map((id) => (
                <div key={id}>
                    {members[id] ?? id}
                </div>
            ))}

        </div>
    )
}