import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/ui/auth/SessionWrapper";
import { Toaster } from "sonner";
// import ConfigureAmplifyClientSide from "@/config/amplifyCognitoConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* <ConfigureAmplifyClientSide /> */}
          {children}
          <Toaster />
        </body>
      </html>
    </SessionWrapper>
  );
}
