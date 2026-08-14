"use client";

import { useEffect } from "react";

type TelegramUser = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
};

type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  close: () => void;
  openLink?: (url: string) => void;
  initData?: string;
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

function parseUserFromInitData(initData: string): TelegramUser | undefined {
  try {
    const userRaw = new URLSearchParams(initData).get("user");
    if (!userRaw) {
      return undefined;
    }
    const user = JSON.parse(userRaw) as TelegramUser;
    const id = Number(user.id);
    if (!Number.isFinite(id) || id === 0) {
      return undefined;
    }
    return { ...user, id };
  } catch {
    return undefined;
  }
}

export function getTelegramWebApp(): TelegramWebApp | undefined {
  const webApp = window.Telegram?.WebApp;
  webApp?.ready();
  return webApp;
}

export function getTelegramUser(): TelegramUser | undefined {
  const webApp = getTelegramWebApp();
  const unsafe = webApp?.initDataUnsafe?.user;
  if (unsafe?.id) {
    const id = Number(unsafe.id);
    if (Number.isFinite(id) && id > 0) {
      return { ...unsafe, id };
    }
  }
  return parseUserFromInitData(webApp?.initData ?? "");
}

export function getTelegramUserId(): number | undefined {
  return getTelegramUser()?.id;
}

export function getTelegramUsername(): string | undefined {
  return getTelegramUser()?.username;
}

export function getTelegramDisplayName(): string {
  const user = getTelegramUser();
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  if (name) {
    return name;
  }
  if (user?.username) {
    return user.username;
  }
  return "Гость";
}

export function getTelegramInitData(): string {
  return getTelegramWebApp()?.initData ?? "";
}

export function closeMiniApp() {
  getTelegramWebApp()?.close();
}

export function openTelegramLink(url: string) {
  const webApp = getTelegramWebApp();
  if (webApp?.openLink) {
    webApp.openLink(url);
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
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
