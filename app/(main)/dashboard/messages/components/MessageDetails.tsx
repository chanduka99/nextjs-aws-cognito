import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Message {
  NotificationId: string;
  CustomerId: string;
  PhoneNo?: string;
  Email?: string;
  Status: string;
  CreatedAt: number;
  Content?: string;
}

interface MessageDetailsProps {
  message: Message;
  onClose: () => void;
}

const statusColors = {
  PROCESSING: "bg-yellow-100 text-yellow-800",
  SENT: "bg-blue-100 text-blue-800",
  DELIVERED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};

export function MessageDetails({ message, onClose }: MessageDetailsProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Message Details
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Customer ID:</span>
            <span className="col-span-2">{message.CustomerId}</span>
          </div>
          {message.PhoneNo && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-medium">Phone Number:</span>
              <span className="col-span-2">{message.PhoneNo}</span>
            </div>
          )}
          {message.Email && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-medium">Email:</span>
              <span className="col-span-2">{message.Email}</span>
            </div>
          )}
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Status:</span>
            <span className="col-span-2">
              <Badge
                className={
                  statusColors[message.Status as keyof typeof statusColors]
                }
              >
                {message.Status}
              </Badge>
            </span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Created At:</span>
            <span className="col-span-2">
              {new Date(message.CreatedAt * 1000).toLocaleString()}
            </span>
          </div>
          {message.Content && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-medium">Content:</span>
              <span className="col-span-2">{message.Content}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
