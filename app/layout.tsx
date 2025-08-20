import type React from "react";
import { Urbanist } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "ECI Data Analytics",
  description:
    "AI-powered electoral data analysis that ensures transparency and accuracy in democratic processes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;  
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={urbanist.className} suppressHydrationWarning>
          <div className="flex h-screen overflow-hidden">
            <div className="flex-1 overflow-auto">{children}</div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
