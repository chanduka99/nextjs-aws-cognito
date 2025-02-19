import { authOptions } from "@/config/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Sidebar } from "./components/Sidebar";
import MessagesPage from "./components/MessagesPage";
import AdminPage from "./components/AdminPage";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }
  // check if user is admin
  let isAdmin = false;
  if (session.user.role == "Admins") {
    isAdmin = true;
  }
  console.log("sesssion :", session);
  return (
    <div className="flex h-screen">
      <Sidebar isAdmin={isAdmin} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto ">
        {/* <MessagesPage /> */}
        <AdminPage />
      </main>
    </div>
  );
}
