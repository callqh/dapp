import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "first dapp",
  description: "dapp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full `}
      >
        <Providers>
          <Header/>
          <div className="flex justify-center mt-3">
          <Card>
            <CardContent>
              {children}
            </CardContent>
          </Card>
          </div>
        </Providers>
      </body>
    </html>
  );
}
