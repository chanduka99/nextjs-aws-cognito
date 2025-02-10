import { authOptions } from "@/config/authOptions";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="flex items-center justify-center">
      <p>{`Welcome ${session.user?.email}`}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
