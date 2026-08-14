import { createHmac, timingSafeEqual } from "node:crypto";
import { runtimeEnv } from "@/lib/env";

const TTL_MS = 1000 * 60 * 60 * 24 * 30;

function sign(payload: string, token: string): string {
  return createHmac("sha256", token).update(payload).digest("base64url");
}

function equal(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function signShopSession(userId: number): string {
  const token = runtimeEnv("TELEGRAM_BOT_TOKEN");
  if (!token || userId <= 0) {
    return "";
  }
  const payload = `${userId}.${Date.now() + TTL_MS}`;
  return `${payload}.${sign(payload, token)}`;
}

export function verifyShopSession(session: string): number | undefined {
  const token = runtimeEnv("TELEGRAM_BOT_TOKEN");
  const [idRaw, expRaw, signature] = session.trim().split(".");
  if (!token || !idRaw || !expRaw || !signature) {
    return undefined;
  }
  const payload = `${idRaw}.${expRaw}`;
  if (!equal(sign(payload, token), signature)) {
    return undefined;
  }
  const userId = Number(idRaw);
  const exp = Number(expRaw);
  if (!Number.isFinite(userId) || userId <= 0 || Date.now() > exp) {
    return undefined;
  }
  return userId;
}

export function shopUrlWithSession(baseUrl: string, userId: number): string {
  if (!baseUrl) {
    return "";
  }
  const url = new URL(baseUrl.includes("://") ? baseUrl : `https://${baseUrl}`);
  const session = signShopSession(userId);
  if (session) {
    url.searchParams.set("sid", session);
  }
  return url.toString();
}
