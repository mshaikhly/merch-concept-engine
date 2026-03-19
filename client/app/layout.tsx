import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RabbitHole AI",
  description:
    "Turn scattered AI conversations into structured thinking trees. Explore ideas, expand insights, and organize knowledge.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
        ${geistSans.variable}
        ${geistMono.variable}
       bg-neutral-950
       text-neutral-100
        font-sans
        min-h-screen
        antialiased
        `}
      >
        <div className="max-w-6xl mx-auto px-6 py-8">
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-100">
              🐇 RabbitHole AI
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Explore ideas as structured knowledge trees instead of endless AI chats.
            </p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}