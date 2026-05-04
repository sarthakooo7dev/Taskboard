"use client"
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 👇 Prevent hydration mismatch
    if (!mounted) return null;

    const isDark = theme === "dark";

    return (

        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="px-3 h-8 rounded-md bg-dk_grey border border-[rgb(50,49,54)]
             hover:bg-lg_grey/30 transition-all duration-200 "
            aria-label="Toggle theme"
        >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>


    );
}