export type StoredOrder = {
  id: number;
  chatId: number;
  priceRub: number;
  nonce: string;
};

const orders = new Map<number, StoredOrder>();

function randomNonce(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function createOrder(chatId: number, priceRub: number): StoredOrder {
  let id = 10000 + Math.floor(Math.random() * 90000);
  for (let attempt = 0; attempt < 12 && orders.has(id); attempt += 1) {
    id = 10000 + Math.floor(Math.random() * 90000);
  }
  const order: StoredOrder = { id, chatId, priceRub, nonce: randomNonce() };
  orders.set(id, order);
  return order;
}

export function getOrder(id: number): StoredOrder | undefined {
  return orders.get(id);
}

export function refreshOrderLink(id: number): StoredOrder | undefined {
  const order = orders.get(id);
  if (!order) {
    return undefined;
  }
  const next = { ...order, nonce: randomNonce() };
  orders.set(id, next);
  return next;
}

export function payUrlFor(baseUrl: string, order: StoredOrder): string {
  const url = new URL(`${baseUrl.replace(/\/$/, "")}/pay/${order.id}`);
  url.searchParams.set("t", order.nonce);
  url.searchParams.set("sum", String(order.priceRub));
  return url.toString();
}

export function orderMessageHtml(orderId: number, priceRub: number, bot: string): string {
  const amount = priceRub.toFixed(2);
  return [
    `Бот заботливо собрал все ваши покупки в заказ <b>№${orderId}</b>. Осталось только его оплатить.`,
    "",
    `Сумма к оплате <b>${amount} руб.</b>`,
    "",
    "Ссылка работает только один раз, если нужно её обновить — просто нажмите на кнопку под этим сообщением.",
    "",
    `Не получается оплатить? Напишите на @${bot}, разберёмся.`,
  ].join("\n");
}

export function payKeyboard(payUrl: string, orderId: number) {
  return {
    inline_keyboard: [
      [{ text: "💳 Оплатить", url: payUrl }],
      [{ text: "🔄 Обновить", callback_data: `refresh:${orderId}` }],
    ],
  };
}
