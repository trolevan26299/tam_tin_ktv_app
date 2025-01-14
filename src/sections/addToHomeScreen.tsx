import { useEffect, useState } from "react";

export default function AddToHomeScreen() {
    const [isWebApp, setIsWebApp] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
    useEffect(() => {
      // Lắng nghe sự kiện beforeinstallprompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
      });
  
      // Kiểm tra Telegram WebApp
      const tg = window.Telegram?.WebApp;
      if (tg) {
        setIsWebApp(true);
        tg.enableClosingConfirmation();
        tg.expand?.();
        tg.MainButton.setText('Thêm vào màn hình chính');
        tg.MainButton.show();
        tg.MainButton.onClick(async () => {
          if (deferredPrompt) {
            // Hiển thị prompt cài đặt PWA
            const result = await deferredPrompt.prompt();
            console.log('Kết quả prompt:', result);
            setDeferredPrompt(null);
          }
        });
      }
    }, [deferredPrompt]);
  
    // Hàm xử lý khi nhấn nút thông thường
    const handleInstall = async () => {
      if (deferredPrompt) {
        const result = await deferredPrompt.prompt();
        console.log('Kết quả prompt:', result);
        setDeferredPrompt(null);
      }
    };
  
    if (isWebApp) return null;
  
    return (
      <button 
        onClick={handleInstall}
        className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-200"
      >
        Thêm vào màn hình chính
      </button>
    );
  }