import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dua & Ruqyah - Hisnul Muslim",
  description: "Islamic Duas and Ruqyah collection",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gray-900 text-white`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
