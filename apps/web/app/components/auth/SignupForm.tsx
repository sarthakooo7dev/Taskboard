"use client";

import { useState } from "react";

const SignupForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        console.log(data);
        // user CREATED here (not logged in yet)
        if (data) {
            alert(data);
        }
    };

    return (
        <>
            <h2>Sign up</h2>

            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {/* SIGNUP ACTION BUTTON */}
            <button onClick={handleSignup}>Create account</button>
        </>
    );
}

export default SignupForm;