/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { lecoNqDB } from "@/utils/lecoNqDB";
import { MessageDetails } from "./MessageDetails";

const statusColors = {
  PROCESSING: "bg-yellow-100 text-yellow-800",
  SENT: "bg-blue-100 text-blue-800",
  DELIVERED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};

interface Message {
  NotificationId: string;
  CustomerId: string;
  PhoneNo?: string;
  Email?: string;
  Status: keyof typeof statusColors;
  CreatedAt: number;
}

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState<"sms" | "email">("sms");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm) {
        setIsLoading(true);
        setError(null);
        try {
          let results;
          if (searchType === "sms") {
            results = await lecoNqDB.searchSmsByPhoneNo({
              phone: searchTerm,
            });
          } else {
            results = await lecoNqDB.searchEmailByAddress({
              email: searchTerm,
            });
          }
          setMessages(results.hits.map((hit: any) => hit.document));
        } catch (error) {
          console.error("Error fetching search results:", error);
          setError(
            error instanceof Error
              ? error.message
              : "An unknown error occurred while searching. Please try again later."
          );
        } finally {
          setIsLoading(false);
        }
      } else {
        setMessages([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchType]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Messages</h2>
      <div className="mb-4 flex space-x-4">
        <Input
          type="text"
          placeholder={`Search by ${
            searchType === "sms" ? "phone number" : "email"
          }...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button
          onClick={() => setSearchType(searchType === "sms" ? "email" : "sms")}
        >
          Switch to {searchType === "sms" ? "Email" : "SMS"}
        </Button>
      </div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>
                  {searchType === "sms" ? "Phone Number" : "Email"}
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.NotificationId}>
                  <TableCell className="font-medium">
                    {message.CustomerId}
                  </TableCell>
                  <TableCell>{message.PhoneNo || message.Email}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[message.Status]}>
                      {message.Status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(message.CreatedAt * 1000).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMessage(message)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {selectedMessage && (
        <MessageDetails
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </div>
  );
}
