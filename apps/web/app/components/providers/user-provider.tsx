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
        if (user) {
            setUser(user);
        }
    }, [user, setUser]);

    return children;
}