// import { redirect } from "next/navigation";

export default async function Dashboard() {
  // if () {
  //   redirect("/login");
  // }
  return (
    <div className="flex items-center justify-center">
      <p>{`Welcome user`}</p>
      {/* <button onClick={() => signOut()}>Sign out</button> */}
    </div>
  );
}
