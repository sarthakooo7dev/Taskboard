"use client"

import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

// ✅ create socket once
const socket: Socket = io("http://localhost:4000")

export default function TestPresence({
    userId,
}: {
    userId: string
}) {
    const [boardId, setBoardId] = useState("")
    const [users, setUsers] = useState<string[]>([])
    const [members, setMembers] = useState<Record<string, string>>({})
    const [notifications, setNotifications] = useState<any[]>([])

    // 🔥 REGISTER + NOTIFICATION LISTENER
    useEffect(() => {
        if (!userId) return

        // register user to personal room
        socket.emit("REGISTER", { userId })
        console.log("✅ Registered user:", userId)

        // notification handler
        const handleNotification = (data: any) => {
            console.log("🔥 Notification received:", data)

            // add to UI
            setNotifications((prev) => [data, ...prev])
        }

        socket.on("notification", handleNotification)

        return () => {
            socket.off("notification", handleNotification)
        }
    }, [userId])

    // 🔥 JOIN BOARD (presence)
    async function joinBoard() {
        if (!boardId) return

        const res = await fetch(`/api/boards/${boardId}/members`)
        const resData = await res.json()

        const map: Record<string, string> = {}

        for (const member of resData.data) {
            map[member.user.id] = member.user.name
        }

        setMembers(map)

        socket.emit("JOIN_BOARD", {
            boardId,
            userId,
        })

        socket.on("PRESENCE_UPDATE", (users: string[]) => {
            setUsers(users)
        })
    }

    return (
        <div style={{ marginTop: 40, padding: 20 }}>
            <h2>Realtime Test (Presence + Notifications)</h2>

            {/* BOARD JOIN */}
            <div style={{ marginTop: 20 }}>
                <input
                    placeholder="Enter Board ID"
                    value={boardId}
                    onChange={(e) => setBoardId(e.target.value)}
                    style={{ border: "1px solid gray", padding: 6 }}
                />

                <button onClick={joinBoard} style={{ marginLeft: 10 }}>
                    Join Board
                </button>
            </div>

            {/* PRESENCE */}
            <h3 style={{ marginTop: 30 }}>Users on board</h3>

            {users.length === 0 && <div>No users online</div>}

            {users.map((id) => (
                <div key={id}>{members[id] ?? id}</div>
            ))}

            {/* NOTIFICATIONS */}
            <h3 style={{ marginTop: 30 }}>Notifications</h3>

            {notifications.length === 0 && <div>No notifications</div>}

            {notifications.map((n, i) => (
                <div
                    key={i}
                    style={{
                        border: "1px solid gray",
                        padding: 10,
                        marginTop: 8,
                        borderRadius: 6,
                    }}
                >
                    <div><strong>Type:</strong> {n.type}</div>
                    <div><strong>From:</strong> {n.actorId}</div>
                    <div><strong>Task:</strong> {n.entityId}</div>
                    <div><strong>creator</strong> {n.creator}</div>
                    <div><strong>info:</strong> {JSON.stringify(n.info)}</div>
                    <div><strong>info:</strong> {JSON.stringify(n.mentionedIds)}</div>
                </div>
            ))}
        </div>
    )
}