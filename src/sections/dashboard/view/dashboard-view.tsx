"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { User } from "@/types/user.type";
import { SplashScreen } from "@/components/loading-screen";

export default function DashboardView() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleTelegramAuth = async () => {
    // Lấy thông tin Telegram user
    const tg = window.Telegram?.WebApp;
    const telegramUser = tg?.initDataUnsafe?.user 

    if (!telegramUser) {
      setError(
        "Không thể lấy thông tin Telegram. Vui lòng truy cập qua Telegram Web App"
      );
      return;
    }

    // Gọi API authentication
    const response = await fetch("/api/auth/telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        telegramUserId: telegramUser.id,
        telegramUsername: telegramUser.username,
      }),
    });

    const data = await response.json();

    if (data.authorized) {
      localStorage.setItem("authToken", data.authToken);
      localStorage.setItem("userData", JSON.stringify(data.user));
      setUser(data.user);
    } else {
      router.push("/403");
    }
  };
  
const handleApiCall = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("authToken");
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      // Token không hợp lệ, xóa token cũ và đăng nhập lại
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      await handleTelegramAuth();
      
      // Thử lại request với token mới
      const newToken = localStorage.getItem("authToken");
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    }

    return response;
  } catch (error) {
    throw error;
  }
};
  useEffect(() => {
  const authenticateUser = async () => {
    try {
      const existingToken = localStorage.getItem("authToken");
      if (existingToken) {
        // Sử dụng handleApiCall thay vì fetch trực tiếp
        const validateResponse = await handleApiCall("/api/auth/validate");

        if (validateResponse.ok) {
          const userData = JSON.parse(
            localStorage.getItem("userData") || "{}"
          );
          setUser(userData);
          setLoading(false);
          return;
        }
      } else {
        await handleTelegramAuth();
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra trong quá trình xác thực");
    } finally {
      setLoading(false);
    }
  };

  authenticateUser();
}, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center ">
        <SplashScreen />
      </main>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold mb-2">Lỗi</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
      {user && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
              Xin chào {user.name}
            </h1>
          </div>

          <div className="flex flex-col gap-5 w-full max-w-md">
            <Button
              onClick={() => router.push("/scan")}
              className="h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-500/30"
            >
              🔍 Scan thiết bị
            </Button>

            <Button
              onClick={() => router.push("/repair")}
              className="h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-purple-500/30"
            >
              🔧 Sửa chữa
            </Button>

            <Button
              onClick={() => router.push(`/history-linhkien?userId=${user.id}`)}
              className="h-14 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-indigo-500/30"
            >
              📦 Linh kiện đã ứng
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
