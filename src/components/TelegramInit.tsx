"use client";

import { useEffect } from "react";

type TelegramUser = {
  id: number;
  username?: string;
};

type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  close: () => void;
  initDataUnsafe?: {
    user?: TelegramUser;
  };
};

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function getTelegramUserId(): number | undefined {
  return window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
}

export function getTelegramUsername(): string | undefined {
  return window.Telegram?.WebApp?.initDataUnsafe?.user?.username;
}

export function closeMiniApp() {
  window.Telegram?.WebApp?.close();
}

export function TelegramInit() {
  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) {
      return;
    }

    webApp.ready();
    webApp.expand();
  }, []);

  return null;
}
