import { authOptions } from "@/config/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Sidebar } from "./components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  let isAdmin = false;
  if (session.user.role === "Admins") {
    isAdmin = true;
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        isAdmin={isAdmin}
        userName={session.user.name ? session.user.name : "User Name not found"}
        email={session.user.email ? session.user.email : "Email Not found"}
      />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
