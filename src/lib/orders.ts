export type StoredOrder = {
  id: number;
  chatId: number;
  username: string;
  platform: string;
  region: string;
  denomination: string;
  priceRub: number;
  createdAt: string;
};

const orders = new Map<number, StoredOrder>();

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function safeText(value: string): string {
  return value.replace(/[\u00a0\u202f\u2009]/g, " ");
}

export function formatOrderWhen(iso: string): string {
  return safeText(
    new Date(iso).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })
  );
}

export function formatOrderSum(priceRub: number): string {
  return `${safeText(priceRub.toLocaleString("ru-RU"))} ₽`;
}

export function createOrder(input: {
  chatId: number;
  username?: string;
  platform: string;
  region: string;
  denomination: string;
  priceRub: number;
}): StoredOrder {
  let id = 10000 + Math.floor(Math.random() * 90000);
  for (let attempt = 0; attempt < 12 && orders.has(id); attempt += 1) {
    id = 10000 + Math.floor(Math.random() * 90000);
  }
  const order: StoredOrder = {
    id,
    chatId: input.chatId,
    username: input.username ?? "",
    platform: input.platform,
    region: input.region,
    denomination: input.denomination,
    priceRub: input.priceRub,
    createdAt: new Date().toISOString(),
  };
  orders.set(id, order);
  return order;
}

export function managerOrderHtml(
  order: StoredOrder,
  username?: string
): string {
  const who = username ? `@${username}` : `id ${order.chatId}`;
  return [
    "<b>Новый заказ</b>",
    "",
    `Заказ <b>№${order.id}</b>`,
    `Клиент: ${escapeHtml(who)}`,
    `Товар: ${escapeHtml(order.platform)} · ${escapeHtml(order.denomination)}`,
    `Регион: ${escapeHtml(order.region)}`,
    `Сумма: <b>${escapeHtml(formatOrderSum(order.priceRub))}</b>`,
  ].join("\n");
}

export function receiptMessageHtml(order: StoredOrder): string {
  return [
    "<b>Чек о покупке</b>",
    "",
    `Заказ <b>№${order.id}</b>`,
    `Товар: ${escapeHtml(order.platform)} · ${escapeHtml(order.denomination)}`,
    `Регион: ${escapeHtml(order.region)}`,
    `Сумма: <b>${escapeHtml(formatOrderSum(order.priceRub))}</b>`,
    `Дата: ${escapeHtml(formatOrderWhen(order.createdAt))}`,
  ].join("\n");
}

export function receiptMessageText(order: StoredOrder): string {
  return [
    "Чек о покупке",
    "",
    `Заказ №${order.id}`,
    `Товар: ${order.platform} · ${order.denomination}`,
    `Регион: ${order.region}`,
    `Сумма: ${formatOrderSum(order.priceRub)}`,
    `Дата: ${formatOrderWhen(order.createdAt)}`,
  ].join("\n");
}
