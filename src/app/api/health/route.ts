import { NextResponse } from "next/server";
import { runtimeEnv } from "@/lib/env";
import { isSheetsConfigured } from "@/lib/sheets";

export async function GET() {
  return NextResponse.json({
    ok: true,
    botToken: Boolean(runtimeEnv("TELEGRAM_BOT_TOKEN")),
    sheets: isSheetsConfigured(),
  });
}
