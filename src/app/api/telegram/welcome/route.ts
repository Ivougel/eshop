import { NextResponse } from "next/server";
import { runtimeEnv } from "@/lib/env";
import { appUrlFrom } from "@/lib/telegram";
import { validateInitData } from "@/lib/validate-init-data";
import { sendWelcome } from "@/lib/welcome";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { telegramInitData?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const token = runtimeEnv("TELEGRAM_BOT_TOKEN");
  const initData =
    typeof body.telegramInitData === "string" ? body.telegramInitData.trim() : "";
  if (!token) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const validated = validateInitData(initData, token);
  if (!validated) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const sent = await sendWelcome(
    token,
    validated.user.id,
    appUrlFrom(request)
  );

  return NextResponse.json({ ok: sent });
}
