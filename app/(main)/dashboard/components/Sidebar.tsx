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

const sidebarItems = [
  { icon: MessageSquare, label: "Messages", active: true },
  { icon: Settings, label: "Settings" },
  { icon: Bell, label: "Notifications" },
  { icon: Search, label: "Search" },
  { icon: Crown, label: "Admin" },
];

interface SidebarProps {
  isAdmin: boolean;
}

export function Sidebar(props: SidebarProps) {
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
                return SidebarMenuItem({ item, index });
              } else {
                return null;
              }
            } else {
              return SidebarMenuItem({ item, index });
            }
          })}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center mb-4">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">John Doe</p>
            <p className="text-sm text-gray-500">john@example.com</p>
          </div>
        </div>
        <Button variant="outline" className="w-full">
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
    active: boolean;
  };
  index: number;
}
function SidebarMenuItem({ item, index }: SidebarMenuItemProps) {
  return (
    <li key={index}>
      <a
        href="#"
        className={cn(
          "flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100",
          item.active && "bg-gray-100 text-foreground"
        )}
      >
        <item.icon className="h-5 w-5 mr-3" />
        {item.label}
      </a>
    </li>
  );
}
