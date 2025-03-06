"use client";
import {
  MessageSquare,
  Settings,
  Bell,
  Search,
  LogOut,
  Crown,
  LucideProps,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const sidebarItems = [
  { icon: MessageSquare, label: "Messages", path: "/dashboard/messages" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
  { icon: Search, label: "Search", path: "/dashboard/search" },
  { icon: Crown, label: "Admin", path: "/dashboard/admin" },
];

interface SidebarProps {
  isAdmin: boolean;
  userName: string;
  email: string | undefined;
}

export function Sidebar(props: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full w-64 bg-white border-r">
      <div className="flex items-center justify-center h-16 border-b">
        <h1 className="text-xl font-semibold">Notification Queue</h1>
      </div>
      <nav className="flex-1">
        <ul>
          {sidebarItems.map((item, index) => {
            if (item.label == "Admin") {
              if (props.isAdmin) {
                return (
                  <SidebarMenuItem
                    key={index}
                    item={item}
                    isActive={pathname === item.path}
                    onClick={() => router.push(item.path)}
                  />
                );
              }
              return null;
            }
            return (
              <SidebarMenuItem
                key={index}
                item={item}
                isActive={pathname === item.path}
                onClick={() => router.push(item.path)}
              />
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center mb-4">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback>{props.userName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{props.userName}</p>
            {/* <p className="text-sm text-gray-500">{props.email}</p> */}
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={() => signOut()}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}

interface SidebarMenuItemProps {
  item: {
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    label: string;
    path: string;
  };
  isActive: boolean;
  onClick: () => void;
}

function SidebarMenuItem({ item, isActive, onClick }: SidebarMenuItemProps) {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "flex w-full items-center px-6 py-3 text-gray-700 hover:bg-gray-100",
          isActive && "bg-gray-100 text-foreground"
        )}
      >
        <item.icon className="h-5 w-5 mr-3" />
        {item.label}
      </button>
    </li>
  );
}
