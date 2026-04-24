"use client";

import { useEffect } from "react";
import { useUserStore } from "../../store/user-store";

/**
 * This component bridges:
 * SERVER → CLIENT (Zustand)
 *
 * It receives user from server
 * and stores it in Zustand
 */
export default function UserProvider({
    user,
    children,
}: {
    user: any;
    children: React.ReactNode;
}) {
    const setUser = useUserStore((s) => s.setUser);

    useEffect(() => {
        loadUser()
    }, [setUser])

    async function loadUser() {
        try {
            const res = await fetch("/api/user/me", {
                credentials: "include",
            })

            if (!res.ok) {
                throw new Error("Failed to fetch user")
            }

            const userData = await res.json()

            console.log("----provider ---" + JSON.stringify(userData.data))
            setUser(userData.data)
        } catch (err) {
            console.error(err)
        }
    }

    return children;
}