import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TripVerseAI | Your Intelligent Travel Architect",
  description: "AI-powered travel planner that generates hyper-personalized itineraries based on user mood, budget, and preferences.",
  icons: {
    icon: '/logo.png',
  }
};
import ChatBot from "@/components/chat/ChatBot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen relative pt-16 selection:bg-[#6C63FF]/30 selection:text-[#6C63FF] antialiased`}>
        <Navbar />
        {children}
        <ChatBot />
      </body>
    </html>
  );
}
