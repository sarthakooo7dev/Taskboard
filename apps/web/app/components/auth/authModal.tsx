"use client";

import { useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

const AuthModal = () => {
    const [mode, setMode] = useState<"signup" | "login" | null>(null);

    return (
        <div>
            {/* TWO DIFFERENT BUTTONS */}
            <button onClick={() => setMode("signup")}>Sign up</button>
            <button onClick={() => setMode("login")}>Login</button>

            {mode === "signup" && <SignupForm />}
            {mode === "login" && <LoginForm />}
        </div>
    );
}


export default AuthModal