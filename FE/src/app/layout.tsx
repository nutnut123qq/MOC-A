import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { googleFontsUrl } from "@/data/fonts";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WalletProvider } from "@/contexts/WalletContext";
import ToastProvider from "@/components/ui/ToastProvider";

// const Toaster = dynamic(() => import('react-hot-toast').then(mod => ({ default: mod.Toaster })), {
//   ssr: false
// });
// import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mộc - Thiết Kế Decal Chuyên Nghiệp",
  description: "Tạo thiết kế decal độc đáo cho áo, mũ, túi canvas với công cụ thiết kế trực tuyến hiện đại",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link href={googleFontsUrl} rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#E21C34" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white`}
      >
        <AuthProvider>
          <WalletProvider>
            <CartProvider>
              <Header />
              <main>
                {children}
              </main>
              <ToastProvider />
              {/* <ServiceWorkerRegistration /> */}
            </CartProvider>
          </WalletProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
