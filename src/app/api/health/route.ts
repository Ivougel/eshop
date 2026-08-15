import { NextResponse } from "next/server";
import { runtimeEnv } from "@/lib/env";

export async function GET() {
  const managerId = runtimeEnv("TELEGRAM_MANAGER_CHAT_ID");
  return NextResponse.json({
    ok: true,
    botToken: Boolean(runtimeEnv("TELEGRAM_BOT_TOKEN")),
    manager: Boolean(managerId),
    managerTail: managerId ? managerId.slice(-4) : "",
  });
}
