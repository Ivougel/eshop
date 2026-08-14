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
    TelegramWebviewProxy?: unknown;
  }
}

const INIT_CACHE = "icity-tg-init";
const USER_CACHE = "icity-tg-user";
const SESSION_CACHE = "icity-tg-sid";

function storageGet(key: string): string {
  try {
    return sessionStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function storageSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function readCachedUser(): TelegramUser | undefined {
  try {
    const raw = storageGet(USER_CACHE);
    if (!raw) {
      return undefined;
    }
    const user = JSON.parse(raw) as TelegramUser;
    const id = Number(user.id);
    return Number.isFinite(id) && id > 0 ? { ...user, id } : undefined;
  } catch {
    return undefined;
  }
}

function cacheUser(user: TelegramUser) {
  storageSet(USER_CACHE, JSON.stringify(user));
}

export function parseInitData(initData: string): TelegramUser | undefined {
  try {
    const params = new URLSearchParams(initData);
    const userRaw = params.get("user") ?? params.get("tgWebAppData");
    if (!userRaw) {
      return undefined;
    }
    if (userRaw.includes("user=")) {
      return parseInitData(userRaw);
    }
    const user = JSON.parse(userRaw) as TelegramUser;
    const id = Number(user.id);
    if (!Number.isFinite(id) || id <= 0) {
      return undefined;
    }
    return { ...user, id };
  } catch {
    return undefined;
  }
}

function pickInitData(raw: string): string {
  if (!raw) {
    return "";
  }
  const params = new URLSearchParams(raw);
  const nested = params.get("tgWebAppData");
  if (nested) {
    return nested;
  }
  if (params.get("user") && params.get("hash")) {
    return raw;
  }
  return "";
}

function initDataFromLocation(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return (
    pickInitData(window.location.hash.replace(/^#/, "")) ||
    pickInitData(window.location.search.replace(/^\?/, ""))
  );
}

export function captureShopSession(): string {
  if (typeof window === "undefined") {
    return "";
  }
  const fromQuery = new URLSearchParams(window.location.search).get("sid")?.trim();
  const fromPath = decodeURIComponent(
    window.location.pathname.match(/^\/s\/([^/]+)/)?.[1] ?? ""
  ).trim();
  const sid = fromQuery || fromPath;
  if (sid) {
    storageSet(SESSION_CACHE, sid);
    const id = Number(sid.split(".")[0]);
    if (Number.isFinite(id) && id > 0 && !readCachedUser()) {
      cacheUser({ id });
    }
    return sid;
  }
  return storageGet(SESSION_CACHE);
}

export function getShopSession(): string {
  return captureShopSession();
}

function userFromSession(): TelegramUser | undefined {
  const id = Number(captureShopSession().split(".")[0]);
  return Number.isFinite(id) && id > 0 ? { id } : undefined;
}

export function captureTelegramInitData(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const fromLocation = initDataFromLocation();
  if (fromLocation) {
    storageSet(INIT_CACHE, fromLocation);
    const user = parseInitData(fromLocation);
    if (user) {
      cacheUser(user);
    }
  }

  const webAppData = window.Telegram?.WebApp?.initData?.trim() ?? "";
  if (webAppData) {
    storageSet(INIT_CACHE, webAppData);
    const user = parseInitData(webAppData);
    if (user) {
      cacheUser(user);
    }
    return webAppData;
  }

  try {
    const stored = storageGet("__telegram__initParams");
    if (stored) {
      const parsed = JSON.parse(stored) as { tgWebAppData?: string };
      if (parsed.tgWebAppData) {
        storageSet(INIT_CACHE, parsed.tgWebAppData);
        return parsed.tgWebAppData;
      }
    }
  } catch {
    /* ignore */
  }

  return fromLocation || storageGet(INIT_CACHE);
}

export function getTelegramWebApp(): TelegramWebApp | undefined {
  const webApp = window.Telegram?.WebApp;
  webApp?.ready();
  return webApp;
}

export function getTelegramUser(): TelegramUser | undefined {
  const webApp = window.Telegram?.WebApp;
  const unsafe = webApp?.initDataUnsafe?.user;
  if (unsafe?.id) {
    const id = Number(unsafe.id);
    if (Number.isFinite(id) && id > 0) {
      const user = { ...unsafe, id };
      cacheUser(user);
      return user;
    }
  }

  const fromInit = parseInitData(captureTelegramInitData());
  if (fromInit) {
    cacheUser(fromInit);
    return fromInit;
  }

  const cached = readCachedUser();
  if (cached) {
    return cached;
  }

  return userFromSession();
}

export function getTelegramUserId(): number | undefined {
  return getTelegramUser()?.id ?? userFromSession()?.id;
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
  return captureTelegramInitData();
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

function bootTelegram(): boolean {
  captureShopSession();
  captureTelegramInitData();
  const webApp = window.Telegram?.WebApp;
  if (!webApp) {
    return false;
  }
  webApp.ready();
  webApp.expand();
  getTelegramUser();
  return true;
}

if (typeof window !== "undefined") {
  captureShopSession();
  captureTelegramInitData();
}

export function TelegramInit() {
  useEffect(() => {
    captureShopSession();
    captureTelegramInitData();
    if (bootTelegram()) {
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="telegram-web-app.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => bootTelegram());
      const waitForInjected = window.setTimeout(() => bootTelegram(), 400);
      return () => window.clearTimeout(waitForInjected);
    }

    const waitForInjected = window.setTimeout(() => {
      if (bootTelegram()) {
        return;
      }
      if (getTelegramUser()) {
        return;
      }
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.async = true;
      script.onload = () => bootTelegram();
      document.head.appendChild(script);
    }, 400);

    return () => window.clearTimeout(waitForInjected);
  }, []);

  return null;
}
