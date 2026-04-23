import { getServerSession } from "next-auth";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";
import UserProvider from "../components/providers/user-provider";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }



    return (
        <UserProvider user={session?.user}>
            <div className="h-screen p-2 box-border">
                <div className="flex h-full rounded-tl-md rounded-tr-md ">

                    {/* Sidebar */}
                    <Sidebar />

                    {/* Right Section */}
                    <div className="flex flex-col flex-1 min-h-0">

                        {/* Header */}
                        <Header />

                        {/* Main */}
                        <main className="flex-1  overflow-auto">
                            {children}
                        </main>

                    </div>
                </div>
            </div>
        </UserProvider>
    );
}