import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { TRPCProvider } from "@/providers/trpc-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chai aur Code — Talk to Hitesh & Piyush",
  description:
    "Chat with AI personas of Hitesh Choudhary and Piyush Garg. Learn to code in their voice.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-dvh flex-col overflow-hidden">
        <ThemeProvider>
          <TRPCProvider>
            {children}
            <Toaster richColors position="top-center" />
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
