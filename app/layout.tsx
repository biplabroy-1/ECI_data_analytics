
import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Urbanist } from "next/font/google";

const urbanist = Urbanist({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true
});

export const metadata: Metadata = {
  title: "Electoral Data Analytics",
  description: "Secure voter list analysis tool with AI-powered duplicate detection",
  keywords: ["electoral", "voter", "analysis", "duplicate", "detection", "AI"],
  authors: [{ name: "The Future Network LLP" }]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
          card: "shadow-lg",
          headerTitle: "text-xl font-semibold",
          headerSubtitle: "text-muted-foreground",
        },
        variables: {
          colorPrimary: "#000000",
          colorBackground: "#ffffff",
          colorInputBackground: "#ffffff",
          colorInputText: "#000000",
        }
      }}
    >
      <html lang="en">
        <body
          className={urbanist.className} suppressHydrationWarning>
        
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}