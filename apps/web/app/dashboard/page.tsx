"use client"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../lib/auth";
import Logout from "../components/auth/Logout";
import TestPresence from "../components/testComp/TestPresence";
import { ThemeToggle } from "../components/testComp/theme-toggleBtn";
import { useUserStore } from "../store/user-store";


export default function Page() {
    // const session = await getServerSession(authOptions);

    // if (!session) {
    //     redirect("/");
    // }
    const user = useUserStore((s) => s.user);

    return (
        <>
            <div className="bd_red m-2 ">
                dashboard content
                <h1>Dashboard</h1>
                <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>


            {/* <div className="m-10 p-3 rounded-lg bg-dk_grey">


                <h1>Dashboard</h1>
                <pre>{JSON.stringify(session, null, 2)}</pre>
            </div>
            <div className="bg-background">
                <h1 className="text-xl font-semibold">Theme Test</h1>

                <ThemeToggle />

            </div>
            <div className="bg-red-500 text-white p-4">
                Test Tailwind
            </div>
            <TestPresence userId={(session.user as any).id} />
            <Logout /> */}


        </>
    );
}
