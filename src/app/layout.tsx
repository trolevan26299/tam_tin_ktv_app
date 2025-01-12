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
      <body className={inter.className}>
      <script src="https://telegram.org/js/telegram-web-app.js"></script>
          <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
