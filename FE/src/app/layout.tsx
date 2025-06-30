import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { googleFontsUrl } from "@/data/fonts";
import StorageDebug from "@/components/debug/StorageDebug";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DecalStudio - Thiết Kế Decal Chuyên Nghiệp",
  description: "Tạo thiết kế decal độc đáo cho áo, mũ, túi canvas với công cụ thiết kế trực tuyến hiện đại",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href={googleFontsUrl} rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white`}
      >
        <Header />
        <main>
          {children}
        </main>
        {/* Storage Debug - Only in development */}
        {process.env.NODE_ENV === 'development' && <StorageDebug />}
      </body>
    </html>
  );
}
