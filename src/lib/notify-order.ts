import { managerOrderHtml, receiptMessageHtml, type StoredOrder } from "@/lib/orders";
import { telegramCallRetry, type TelegramCallResult } from "@/lib/telegram";
import { sendWelcome } from "@/lib/welcome";

function receiptBody(order: StoredOrder) {
  return {
    chat_id: order.chatId,
    text: receiptMessageHtml(order),
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };
}

async function sendReceipt(
  token: string,
  order: StoredOrder,
  webAppUrl: string
): Promise<TelegramCallResult> {
  let result = await telegramCallRetry(token, "sendMessage", receiptBody(order));
  if (result.ok) {
    return result;
  }

  const blocked =
    result.errorCode === 403 ||
    /chat not found|blocked|initiate|not enough rights/i.test(result.error ?? "");
  if (!blocked) {
    return result;
  }

  await sendWelcome(token, order.chatId, webAppUrl);
  return telegramCallRetry(token, "sendMessage", receiptBody(order));
}

export async function notifyOrder(input: {
  token: string;
  order: StoredOrder;
  username?: string;
  managerId: number;
  webAppUrl: string;
}): Promise<void> {
  const tasks: Promise<unknown>[] = [
    sendReceipt(input.token, input.order, input.webAppUrl),
  ];

  if (Number.isFinite(input.managerId) && input.managerId !== 0) {
    tasks.push(
      telegramCallRetry(input.token, "sendMessage", {
        chat_id: input.managerId,
        text: managerOrderHtml(input.order, input.username),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      })
    );
  }

  await Promise.all(tasks);
}
