import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/layouts/main.layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tâm Tín - Chuyên cung cấp dịch vụ máy đếm tiền",
  description: "Chuyên cung cấp dịch vụ máy đếm tiền và vật tư máy đếm tiền",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
       <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/public/vercel.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <body className={inter.className}>
      <script src="https://telegram.org/js/telegram-web-app.js"></script>
          <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
