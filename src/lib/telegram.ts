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

export type TelegramCallResult = {
  ok: boolean;
  error?: string;
  errorCode?: number;
  retryAfter?: number;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function telegramCall(
  token: string,
  method: string,
  body: Record<string, unknown>
): Promise<TelegramCallResult> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      description?: string;
      error_code?: number;
      parameters?: { retry_after?: number };
    };
    if (response.ok && data.ok) {
      return { ok: true };
    }
    return {
      ok: false,
      error: data.description ?? `HTTP ${response.status}`,
      errorCode: data.error_code,
      retryAfter: data.parameters?.retry_after,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "network",
    };
  }
}

export async function telegramCallRetry(
  token: string,
  method: string,
  body: Record<string, unknown>
): Promise<TelegramCallResult> {
  let last: TelegramCallResult = { ok: false, error: "network" };

  for (let attempt = 0; attempt < 2; attempt += 1) {
    last = await telegramCall(token, method, body);
    if (last.ok) {
      return last;
    }

    const flood = last.retryAfter ?? (last.errorCode === 429 ? 1 : 0);
    const transient =
      flood > 0 ||
      !last.errorCode ||
      last.errorCode >= 500 ||
      /timeout|network|fetch|Too Many/i.test(last.error ?? "");

    if (!transient || attempt === 1) {
      return last;
    }

    await sleep(Math.min((flood || 1) * 400, 800));
  }

  return last;
}
