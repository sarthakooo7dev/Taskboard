import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../lib/auth";
import Logout from "../components/auth/Logout";
import TestPresence from "../components/testComp/TestPresence";
import { ThemeToggle } from "../components/testComp/theme-toggleBtn";


export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    return (
        <>
            <h1>Dashboard</h1>
            <pre>{JSON.stringify(session, null, 2)}</pre>

            <div className="w-28 h-40 bg-box_1">
                aaaaaaaaaaaaaa
            </div>

            <div className="bg-background">
                <h1 className="text-xl font-semibold">Theme Test</h1>

                <ThemeToggle />

            </div>
            <div className="bg-red-500 text-white p-4">
                Test Tailwind
            </div>
            <TestPresence userId={(session.user as any).id} />
            <Logout />


        </>
    );
}
