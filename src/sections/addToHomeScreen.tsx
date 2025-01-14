'use client';

import { useEffect, useState } from 'react';
import { 
  addToHomeScreen, 
  onAddedToHomeScreen, 
  onAddToHomeScreenFailed,
  checkHomeScreenStatus, 
  offAddedToHomeScreen,
  offAddToHomeScreenFailed
} from '@telegram-apps/sdk';

export default function AddToHomeScreen() {
  const [isWebApp, setIsWebApp] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      setIsWebApp(true);
      tg.enableClosingConfirmation();
      tg.expand?.();
      tg.MainButton.setText('Thêm vào màn hình chính');
      tg.MainButton.show();
      
      // Kiểm tra trạng thái đã được thêm vào màn hình chính chưa
      if (checkHomeScreenStatus.isAvailable()) {
        checkHomeScreenStatus().then(status => {
          console.log('Trạng thái màn hình chính:', status);
        });
      }

      // Xử lý sự kiện khi nhấn nút
      tg.MainButton.onClick(() => {
        if (addToHomeScreen.isAvailable()) {
          addToHomeScreen();
        }
      });

      // Thêm các event listener
      const onAdded = () => {
        console.log('Đã thêm vào màn hình chính thành công');
      };

      const onFailed = () => {
        console.log('Người dùng từ chối thêm vào màn hình chính');
      };

      onAddedToHomeScreen(onAdded);
      onAddToHomeScreenFailed(onFailed);

      // Cleanup
      return () => {
        offAddedToHomeScreen(onAdded);
        offAddToHomeScreenFailed(onFailed);
      };
    }
  }, []);

  if (isWebApp) return null;

  return (
    <button 
      onClick={() => {
        if (addToHomeScreen.isAvailable()) {
          addToHomeScreen();
        }
      }}
      className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-200"
    >
      Thêm vào màn hình chính
    </button>
  );
}