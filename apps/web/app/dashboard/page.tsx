import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../lib/auth";
import Logout from "../components/auth/Logout";

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    return (
        <>
            <h1>Dashboard</h1>
            <pre>{JSON.stringify(session, null, 2)}</pre>

            <Logout />
        </>
    );
}
