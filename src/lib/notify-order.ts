import {
  managerOrderHtml,
  receiptMessageHtml,
  receiptMessageText,
  type StoredOrder,
} from "@/lib/orders";
import { telegramCall, type TelegramCallResult } from "@/lib/telegram";

export type TelegramSender = (
  method: string,
  body: Record<string, unknown>
) => Promise<TelegramCallResult>;

export type NotifyResult = {
  receiptOk: boolean;
  managerOk: boolean;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isParseError(result: TelegramCallResult): boolean {
  return (
    result.errorCode === 400 ||
    /parse entities|can't parse|unsupported start tag/i.test(result.error ?? "")
  );
}

function isFlood(result: TelegramCallResult): boolean {
  return result.errorCode === 429 || /too many requests/i.test(result.error ?? "");
}

function isBlocked(result: TelegramCallResult): boolean {
  return (
    result.errorCode === 403 ||
    /chat not found|blocked|initiate|not enough rights/i.test(result.error ?? "")
  );
}

export function createTelegramSender(token: string): TelegramSender {
  return (method, body) => telegramCall(token, method, body);
}

async function sendReceipt(
  send: TelegramSender,
  order: StoredOrder
): Promise<TelegramCallResult> {
  const html = {
    chat_id: order.chatId,
    text: receiptMessageHtml(order),
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };
  const plain = {
    chat_id: order.chatId,
    text: receiptMessageText(order),
    disable_web_page_preview: true,
  };

  let result = await send("sendMessage", html);
  if (result.ok) {
    return result;
  }

  if (isParseError(result)) {
    result = await send("sendMessage", plain);
    if (result.ok) {
      return result;
    }
  }

  if (isFlood(result)) {
    await sleep(Math.min((result.retryAfter ?? 1) * 1000, 3000));
    result = await send("sendMessage", isParseError(result) ? plain : html);
    if (result.ok) {
      return result;
    }
    result = await send("sendMessage", plain);
    if (result.ok) {
      return result;
    }
  }

  if (isBlocked(result)) {
    await send("sendMessage", {
      chat_id: order.chatId,
      text: "Ваш заказ принят. Ниже чек.",
      disable_web_page_preview: true,
    });
    result = await send("sendMessage", plain);
  }

  return result;
}

export async function notifyOrder(input: {
  token: string;
  order: StoredOrder;
  username?: string;
  managerId: number;
  webAppUrl: string;
  send?: TelegramSender;
}): Promise<NotifyResult> {
  const send = input.send ?? createTelegramSender(input.token);
  const receipt = await sendReceipt(send, input.order);

  let managerOk = true;
  if (Number.isFinite(input.managerId) && input.managerId !== 0) {
    const manager = await send("sendMessage", {
      chat_id: input.managerId,
      text: managerOrderHtml(input.order, input.username),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
    managerOk = manager.ok;
    if (!manager.ok && isParseError(manager)) {
      const retry = await send("sendMessage", {
        chat_id: input.managerId,
        text: managerOrderHtml(input.order, input.username)
          .replaceAll("<b>", "")
          .replaceAll("</b>", ""),
        disable_web_page_preview: true,
      });
      managerOk = retry.ok;
    }
  }

  return { receiptOk: receipt.ok, managerOk };
}
