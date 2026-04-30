import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

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