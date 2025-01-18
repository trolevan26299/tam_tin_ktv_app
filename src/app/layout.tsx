"use client";
import MainLayout from "@/layouts/main.layout";
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import { addToHomeScreen } from "@telegram-apps/sdk-react";
import { AuthProvider } from "@/contexts/auth.context";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Kiểm tra và thêm tính năng Add to Home Screen
    if (addToHomeScreen.isAvailable()) {
      addToHomeScreen();
    }
  }, []);
  return (
    <html lang="en">
      <body className={inter.className}>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        <AuthProvider>
          <MainLayout>
            {children} <Toaster />
          </MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
