import { createHmac, timingSafeEqual } from "node:crypto";

const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function equalHex(left: string, right: string): boolean {
  try {
    const a = Buffer.from(left, "hex");
    const b = Buffer.from(right, "hex");
    return a.length > 0 && a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export type TelegramWebAppUser = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
};

export type ValidatedInitData = {
  user: TelegramWebAppUser;
  authDate: number;
};

function expandInitDataCandidates(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  const add = (value: string) => {
    const next = value.trim();
    if (!next || seen.has(next)) {
      return;
    }
    seen.add(next);
    out.push(next);
  };

  add(raw);
  try {
    add(decodeURIComponent(raw));
  } catch {
    /* ignore */
  }

  const nested = new URLSearchParams(raw).get("tgWebAppData");
  if (nested) {
    add(nested);
    try {
      add(decodeURIComponent(nested));
    } catch {
      /* ignore */
    }
  }

  return out;
}

function validateOnce(
  raw: string,
  botToken: string
): ValidatedInitData | undefined {
  const params = new URLSearchParams(raw);
  const hash = params.get("hash");
  if (!hash) {
    return undefined;
  }
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const computed = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (!equalHex(computed, hash)) {
    return undefined;
  }

  const authDate = Number(params.get("auth_date"));
  if (!Number.isFinite(authDate) || authDate <= 0) {
    return undefined;
  }
  if (Math.floor(Date.now() / 1000) - authDate > MAX_AGE_SEC) {
    return undefined;
  }

  try {
    const user = JSON.parse(params.get("user") ?? "") as TelegramWebAppUser;
    const id = Number(user.id);
    if (!Number.isFinite(id) || id <= 0) {
      return undefined;
    }
    return { user: { ...user, id }, authDate };
  } catch {
    return undefined;
  }
}

export function validateInitData(
  initData: string,
  botToken: string
): ValidatedInitData | undefined {
  const raw = initData.trim();
  if (!raw || !botToken) {
    return undefined;
  }

  for (const candidate of expandInitDataCandidates(raw)) {
    const validated = validateOnce(candidate, botToken);
    if (validated) {
      return validated;
    }
  }

  return undefined;
}
