"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/user.type";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  handleApiCall: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleTelegramAuth = async () => {
    const tg = window.Telegram?.WebApp;
    const telegramUser = tg?.initDataUnsafe?.user || {
      id: 1150203629,
      username: "Tro26299",
    };

    if (!telegramUser) {
      setError("Không thể lấy thông tin Telegram. Vui lòng truy cập qua Telegram Web App");
      return;
    }

    const response = await fetch("/api/auth/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramUserId: telegramUser.id }),
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
          const validateResponse = await handleApiCall("/api/auth/validate");
          if (validateResponse.ok) {
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");
            setUser(userData);
          } else {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userData");
            await handleTelegramAuth();
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
  }, []);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
    }
  }, []);

  return <AuthContext.Provider value={{ user, loading, error, handleApiCall }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
