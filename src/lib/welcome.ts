import { startKeyboard, startMessageHtml } from "@/data/bot-start";
import { telegramCallRetry } from "@/lib/telegram";

const sentAt = new Map<number, number>();
const inflight = new Map<number, Promise<boolean>>();
const DEDUP_MS = 90_000;

export async function sendWelcome(
  token: string,
  chatId: number,
  webAppUrl: string
): Promise<boolean> {
  const pending = inflight.get(chatId);
  if (pending) {
    return pending;
  }

  const last = sentAt.get(chatId) ?? 0;
  if (Date.now() - last < DEDUP_MS) {
    return true;
  }

  const job = deliverWelcome(token, chatId, webAppUrl);
  inflight.set(chatId, job);
  try {
    return await job;
  } finally {
    inflight.delete(chatId);
  }
}

async function deliverWelcome(
  token: string,
  chatId: number,
  webAppUrl: string
): Promise<boolean> {
  const text = startMessageHtml();
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
      sentAt.set(chatId, Date.now());
      return true;
    }
  }

  return false;
}
