/* eslint-disable @typescript-eslint/no-explicit-any */
import { nextLecoNqDBBuilder } from "@geeklabs-co/leco-notification-db";

const typesenseHost = process.env.NEXT_PUBLIC_TYPESENSE_HOST || "localhost";
const typesensePort = Number.parseInt(
  process.env.NEXT_PUBLIC_TYPESENSE_PORT || "8108",
  10
);
const typesenseProtocol = process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || "http";

console.log("Typesense configuration:", {
  typesenseHost,
  typesensePort,
  typesenseProtocol,
});

const originalLecoNqDB = nextLecoNqDBBuilder({
  emailTableName: process.env.NEXT_PUBLIC_EMAIL_TABLE_NAME || "dev-email",
  smsTableName: process.env.NEXT_PUBLIC_SMS_TABLE_NAME || "dev-sms",
  typsenseConfig: {
    nodes: [
      {
        host: typesenseHost,
        port: typesensePort,
        protocol: typesenseProtocol,
      },
    ],
    apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY || "api-key",
    connectionTimeoutSeconds:
      Number(process.env.NEXT_PUBLIC_TYPESENSE_CONNECTION_TIMEOUT) || 2 * 60,
  },
});

const isServer = typeof window === "undefined";

const retryWithDelay = async (
  fn: () => Promise<any>,
  retries = 3,
  delay = 1000
) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryWithDelay(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const lecoNqDB = {
  ...originalLecoNqDB,
  searchSmsByPhoneNo: async ({ phone }: { phone: string }) => {
    if (isServer) {
      return retryWithDelay(() =>
        originalLecoNqDB.searchSmsByPhoneNo({ phone })
      );
    }
    const url = new URL("/api/typesense-proxy", window.location.origin);
    url.searchParams.append("action", "search");
    url.searchParams.append("collection", "sms");
    url.searchParams.append("query", phone);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }
    return response.json();
  },
  searchEmailByAddress: async ({ email }: { email: string }) => {
    if (isServer) {
      return retryWithDelay(() =>
        originalLecoNqDB.searchEmailByAddress({ email })
      );
    }
    const url = new URL("/api/typesense-proxy", window.location.origin);
    url.searchParams.append("action", "search");
    url.searchParams.append("collection", "email");
    url.searchParams.append("query", email);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }
    return response.json();
  },
};
