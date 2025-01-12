'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user.type';


export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {

    const authenticateUser = async () => {
      try {
        const existingToken = localStorage.getItem('authToken');
        if (existingToken) {
          // Validate token với server
          const validateResponse = await fetch('/api/auth/validate', {
            headers: {
              'Authorization': `Bearer ${existingToken}`
            }
          });

          if (validateResponse.ok) {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            setUser(userData);
            setLoading(false);
            return;
          } else {
            // Nếu token không hợp lệ, xóa localStorage và tiếp tục flow đăng nhập
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
          }
        }

        // Lấy thông tin Telegram user
        const tg = window.Telegram?.WebApp;
        console.log("tg",tg);
        const telegramUser = tg?.initDataUnsafe?.user;
        console.log("telegramUser",telegramUser);
        if (!telegramUser) {
          setError('Không thể lấy thông tin Telegram. Vui lòng truy cập qua Telegram Web App');
          setLoading(false);
          return;
        }

        // Gọi API authentication
        const response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            telegramUserId: telegramUser.id,
            telegramUsername: telegramUser.username
          }),
        });

        const data = await response.json();

        if (data.authorized) {
          localStorage.setItem('authToken', data.authToken);
          localStorage.setItem('userData', JSON.stringify(data.user));
          setUser(data.user);
        } else {
          router.push('/403');
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Đã có lỗi xảy ra trong quá trình xác thực');
      } finally {
        setLoading(false);
      }
    };

    authenticateUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
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
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-24">
      {user && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Xin chào, {user.name}</h1>
          
          </div>
          
          <div className="flex flex-col gap-4 w-full max-w-md">
            <Button 
              onClick={() => router.push('/scan')}
              className="h-12 text-lg"
            >
              Scan thiết bị
            </Button>
            
            <Button 
              onClick={() => router.push('/repair')}
              className="h-12 text-lg"
            >
              Sửa chữa
            </Button>
            
            <Button 
              onClick={() => router.push('/parts')}
              className="h-12 text-lg"
            >
              Linh kiện đã ứng
            </Button>
          </div>
        </>
      )}
    </main>
  );
}