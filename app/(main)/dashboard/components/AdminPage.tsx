/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
import CreateUserModal from "./CreateUserModal";
import {
  getUsers,
  type CognitoUser,
} from "../actions/adminPage.getUsers.action";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/shared/loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { deleteUser, disableUser } from "../actions/adminPage.deleteUser.action";

const statusColors = {
  PROCESSING: "bg-yellow-100 text-yellow-800",
  VERIFIED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};

const roles = {
  ADMIN: "Admin",
  STANDARD_USER: "Standard User",
};

export default function AdminPage() {
  const session = useSession();
  const [users, setUsers] = useState<CognitoUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      const userData = await getUsers();
      setUsers(userData);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (session?.status === "authenticated") {
      fetchUsers();
    }
  }, [session?.status]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
  };

  if (session?.status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Loader />
      </div>
    );
  }

  if (session?.status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin</h2>
      <div className="flex flex-col justify-center my-10">
        {`Welcome ${session.data?.user?.name}`}
      </div>
      <div className="my-4 flex  items-center gap-6">
        <CreateUserModal />
        <Button
          size="icon"
          className="rounded-full"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RotateCw className={`h-6 w-6 `} />
        </Button>
      </div>
      {refreshing && (
        <div className="flex justify-center items-center h-[40vh]">
          <Loader />
        </div>
      )}
      {!refreshing && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Verification Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
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
                  {/* {new Date(user.CreatedAt * 1000).toLocaleString()} */}
                  {String(user.CreatedAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={async () => {
                          try {
                            await deleteUser(user.Email);
                            toast.success("User deleted successfully");
                            await fetchUsers();
                          } catch (error) {
                            toast.error("Failed to delete user");
                          }
                        }}
                      >
                        Delete User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async () => {
                          try {
                            await disableUser(user.Email);
                            toast.success("User disabled successfully");
                            await fetchUsers();
                          } catch (error) {
                            toast.error("Failed to disable user");
                          }
                        }}
                      >
                        Disable User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
