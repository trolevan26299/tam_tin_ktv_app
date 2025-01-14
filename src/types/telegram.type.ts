export interface TelegramUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

interface TelegramWebAppInitData {
  user: TelegramUser;
  auth_date: string;
  hash: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: TelegramWebAppInitData;
  ready?: () => void;
  expand?: () => void;
  close?: () => void;
  // Thêm các định nghĩa mới
  enableClosingConfirmation: () => void;
  MainButton: {
      setText: (text: string) => void;
      show: () => void;
      onClick: (callback: () => void) => void;
  };
}

declare global {
  interface Window {
      Telegram?: {
          WebApp: TelegramWebApp;
      };
  }
}