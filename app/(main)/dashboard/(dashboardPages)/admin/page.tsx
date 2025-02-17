import { authOptions } from "@/config/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }
  return (
    <div className="flex justify-center items-center h-[100vh]">{`Welcome ${session.user?.name}`}</div>
  );
}
