import { NextResponse } from "next/server";
import { runtimeEnv } from "@/lib/env";
import { telegramCall } from "@/lib/telegram";

export async function GET() {
  const managerId = runtimeEnv("TELEGRAM_MANAGER_CHAT_ID");
  const token = runtimeEnv("TELEGRAM_BOT_TOKEN");
  const started = Date.now();
  const telegram = token
    ? await telegramCall(token, "getMe", {})
    : { ok: false, error: "no token" };

  return NextResponse.json({
    ok: true,
    botToken: Boolean(token),
    manager: Boolean(managerId),
    managerTail: managerId ? managerId.slice(-4) : "",
    telegram: telegram.ok,
    telegramMs: Date.now() - started,
    telegramError: telegram.ok ? undefined : telegram.error,
  });
}
