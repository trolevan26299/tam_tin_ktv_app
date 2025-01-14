'use client';

import { useEffect, useState } from 'react';



export default function AddToHomeScreen() {
  const [isWebApp, setIsWebApp] = useState(false);

  useEffect(() => {
    // Kiểm tra xem có đang chạy trong Telegram WebApp không
    const tg = window.Telegram?.WebApp;
    if (tg) {
      setIsWebApp(true);
      // Kích hoạt nút "Add to Home Screen" của Telegram
      tg.enableClosingConfirmation();
      tg.expand?.();
      // Thêm nút vào Main Button của Telegram
      tg.MainButton.setText('Thêm vào màn hình chính');
      tg.MainButton.show();
      tg.MainButton.onClick(() => {
        // Xử lý khi người dùng nhấn nút
        console.log('Người dùng đã nhấn nút thêm vào màn hình chính');
      });
    }
  }, []);

  // Nếu đang chạy trong Telegram WebApp, không hiển thị nút của chúng ta
  if (isWebApp) return null;

  // Hiển thị nút thông thường cho các trường hợp khác
  return (
    <button className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-200">
      Thêm vào màn hình chính
    </button>
  );
}