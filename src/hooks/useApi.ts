import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useApi() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const callApi = async (endpoint: string, options: RequestInit = {}) => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        router.push('/');
        return null;
      }

      const response = await fetch(`/api/${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        router.push('/');
        return null;
      }

      if (response.status === 403) {
        router.push('/403');
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { callApi, loading };
}