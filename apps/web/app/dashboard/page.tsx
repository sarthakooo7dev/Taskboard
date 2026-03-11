import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../lib/auth";
import Logout from "../components/auth/Logout";
import TestPresence from "../components/testComp/TestPresence";


export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    return (
        <>
            <h1>Dashboard</h1>
            <pre>{JSON.stringify(session, null, 2)}</pre>
            <TestPresence userId={(session.user as any).id} />
            <Logout />
        </>
    );
}
