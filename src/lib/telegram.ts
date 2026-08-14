import { runtimeEnv } from "@/lib/env";

export function appUrlFrom(request: Request): string {
  const fromEnv = runtimeEnv("TELEGRAM_WEBAPP_URL").replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }

  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  return host ? `${proto}://${host}` : "";
}

export async function telegramCall(
  token: string,
  method: string,
  body: Record<string, unknown>
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      description?: string;
    };
    if (response.ok && data.ok) {
      return { ok: true };
    }
    return { ok: false, error: data.description ?? `HTTP ${response.status}` };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "network",
    };
  }
}
