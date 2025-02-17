/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  PROCESSING: "bg-yellow-100 text-yellow-800",
  VERIFIED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};

const roles = {
  ADMIN: "Admin",
  STANDARD_USER: "Standard User",
};
interface User {
  UserId: string;
  UserName: string;
  Email?: string;
  VerifiedStatus: keyof typeof statusColors;
  CreatedAt: number;
  Role: keyof typeof roles;
}
const users: User[] = [
  {
    UserId: "1",
    UserName: "Alice Johnson",
    Email: "alice@example.com",
    VerifiedStatus: "PROCESSING",
    CreatedAt: 1708166400,
    Role: "ADMIN",
  },
  {
    UserId: "2",
    UserName: "Bob Smith",
    Email: "bob@example.com",
    VerifiedStatus: "VERIFIED",
    CreatedAt: 1708252800,
    Role: "STANDARD_USER",
  },
  {
    UserId: "3",
    UserName: "Charlie Brown",
    VerifiedStatus: "FAILED",
    CreatedAt: 1708339200,
    Role: "STANDARD_USER",
  },
  {
    UserId: "4",
    UserName: "Diana Ross",
    Email: "diana@example.com",
    VerifiedStatus: "PROCESSING",
    CreatedAt: 1708425600,
    Role: "ADMIN",
  },
  {
    UserId: "5",
    UserName: "Ethan Hunt",
    Email: "ethan@example.com",
    VerifiedStatus: "VERIFIED",
    CreatedAt: 1708512000,
    Role: "STANDARD_USER",
  },
];
export default function AdminPage() {
  const session = useSession();
  if (session?.status == "loading") {
    return "Loading...";
  }
  if (session?.status == "unauthenticated") {
    redirect("/login");
  }
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin</h2>
      <div className="flex flex-col justify-center my-10">
        {`Welcome ${session.data?.user?.name}`}
      </div>
      <Button className="flex ">Create New User</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Email Verification Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.UserId}>
              <TableCell className="font-medium">{user.UserId}</TableCell>
              <TableCell>{user.UserName}</TableCell>
              <TableCell>{user.Email}</TableCell>
              <TableCell>
                <Badge className={statusColors[user.VerifiedStatus]}>
                  {user.VerifiedStatus}
                </Badge>
              </TableCell>
              <TableCell>{roles[user.Role]}</TableCell>
              <TableCell>
                {new Date(user.CreatedAt * 1000).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
