import { NextResponse } from "next/server";
import { runtimeEnv } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    ok: true,
    botToken: Boolean(runtimeEnv("TELEGRAM_BOT_TOKEN")),
    managerChat: Boolean(
      runtimeEnv("TELEGRAM_MANAGER_CHAT_ID") || runtimeEnv("TELEGRAM_CHAT_ID")
    ),
  });
}
