"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/loading-screen";
import { useAuth } from "@/contexts/auth.context";

export default function DashboardView() {
  const { user, loading, error } = useAuth();
  const router = useRouter();

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
