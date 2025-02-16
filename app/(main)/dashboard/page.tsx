import { authOptions } from "@/config/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }
  console.log("sesssion :", session);
  return (
    <div className="flex items-center justify-center">
      <p>{`Welcome ${session.user?.name}`}</p>
      {/* <button onClick={() => signOut()}>Sign out</button> */}
    </div>
  );
}
