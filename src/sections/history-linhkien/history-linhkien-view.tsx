"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/loading-screen";
import axios from "axios";

export const HistoryLinhKienView = () => {
  const [userId, setUserId] = useState<string | null>(null);

  const [linhKiens, setLinhKiens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  console.log("linhKiens", linhKiens);
  const fetchLinhKiens = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`/api/linhKien/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.data;
      setLinhKiens(data);
    } catch (error) {
      console.error("Error fetching linh kiens:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Lấy userId từ URL bằng Web API
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("userId");
    setUserId(id);
  }, []);
  useEffect(() => {
    if (userId) {
      fetchLinhKiens();
    }
  }, [userId]);

  if (loading) {
    return <SplashScreen />;
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
          <div className="px-6 py-5 border-b border-gray-700/50 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
            <h2 className="text-2xl font-bold text-white text-center">Lịch Sử Ứng Linh Kiện</h2>
          </div>

          {/* Table Container */}
          <div className="relative" style={{ height: "calc(100vh - 300px)" }}>
            <div className="absolute inset-0 overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {linhKiens.length > 0 ? (
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                        Tên Linh Kiện
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                        Số Lượng
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {linhKiens.map((linhKien) => (
                      <tr key={linhKien._id} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{linhKien.name_linh_kien}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300">
                            {linhKien.data_ung.find((item: any) => item.id === userId)?.total || 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-300 text-lg">Bạn chưa ứng linh kiện nào</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <a
            href="/"
            className="group relative inline-flex items-center px-8 py-3 overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transition-all duration-300 hover:scale-105"
          >
            <span className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500 ease-out group-hover:w-full"></span>
            <span className="relative flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Về Trang Chủ
            </span>
          </a>
        </div>
      </div>
    </main>
  );
};
