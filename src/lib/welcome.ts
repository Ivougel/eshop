import { startAgainHtml, startKeyboard, startMessageHtml } from "@/data/bot-start";
import { telegramCallRetry } from "@/lib/telegram";

const welcomedAt = new Map<number, number>();
const inflight = new Map<number, Promise<boolean>>();
const FULL_WELCOME_MS = 7 * 24 * 60 * 60 * 1000;

export async function sendWelcome(
  token: string,
  chatId: number,
  webAppUrl: string
): Promise<boolean> {
  const pending = inflight.get(chatId);
  if (pending) {
    return pending;
  }

  const last = welcomedAt.get(chatId) ?? 0;
  const job =
    Date.now() - last > FULL_WELCOME_MS
      ? deliverStart(token, chatId, webAppUrl, startMessageHtml())
      : deliverStart(token, chatId, webAppUrl, startAgainHtml());

  inflight.set(chatId, job);
  try {
    const ok = await job;
    if (ok && Date.now() - last > FULL_WELCOME_MS) {
      welcomedAt.set(chatId, Date.now());
    }
    return ok;
  } finally {
    inflight.delete(chatId);
  }
}

async function deliverStart(
  token: string,
  chatId: number,
  webAppUrl: string,
  text: string
): Promise<boolean> {
  const attempts: Record<string, unknown>[] = [];
  if (webAppUrl) {
    attempts.push({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: startKeyboard(webAppUrl),
    });
  }
  attempts.push({
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });

  for (const body of attempts) {
    const result = await telegramCallRetry(token, "sendMessage", body);
    if (result.ok) {
      return true;
    }
  }

  return false;
}
