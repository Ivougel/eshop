import { NextResponse } from "next/server";
import { runtimeEnv } from "@/lib/env";
import { listSheetOrders } from "@/lib/sheets";
import { validateInitData } from "@/lib/validate-init-data";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { telegramInitData?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, orders: [] }, { status: 400 });
  }

  const token = runtimeEnv("TELEGRAM_BOT_TOKEN");
  const initData =
    typeof body.telegramInitData === "string" ? body.telegramInitData.trim() : "";
  if (!token) {
    return NextResponse.json({ success: false, orders: [] }, { status: 500 });
  }

  const validated = validateInitData(initData, token);
  if (!validated) {
    return NextResponse.json({ success: false, orders: [] }, { status: 401 });
  }

  const orders = await listSheetOrders(validated.user.id);
  return NextResponse.json({ success: true, orders });
}
