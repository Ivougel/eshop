import { describe, expect, it } from "vitest";
import { notifyOrder, type TelegramSender } from "@/lib/notify-order";
import { receiptMessageHtml, type StoredOrder } from "@/lib/orders";
import type { TelegramCallResult } from "@/lib/telegram";

function order(over: Partial<StoredOrder> = {}): StoredOrder {
  return {
    id: 20374,
    chatId: 777001,
    username: "mayakoshskii",
    platform: "Roblox",
    denomination: "1700 Robux × 1 · СБП · бонусы",
    region: "Глобальный",
    priceRub: 4290,
    createdAt: "2026-08-15T07:40:00.000Z",
    ...over,
  };
}

function queueSend(results: TelegramCallResult[]) {
  const calls: { method: string; body: Record<string, unknown> }[] = [];
  const send: TelegramSender = async (method, body) => {
    calls.push({ method, body });
    return results.shift() ?? { ok: true };
  };
  return { send, calls };
}

const base = {
  token: "test-token",
  username: "mayakoshskii",
  managerId: 1557402625,
  webAppUrl: "https://shop.example",
};

describe("notifyOrder", () => {
  it("sends the receipt to the buyer before the manager notice", async () => {
    const { send, calls } = queueSend([{ ok: true }, { ok: true }]);
    const result = await notifyOrder({ ...base, order: order(), send });

    expect(result).toEqual({ receiptOk: true, managerOk: true });
    const buyer = calls.filter((item) => item.body.chat_id === 777001);
    const manager = calls.filter((item) => item.body.chat_id === 1557402625);
    expect(buyer.length).toBeGreaterThanOrEqual(1);
    expect(manager).toHaveLength(1);
    expect(String(buyer[0]?.body.text)).toContain("Чек о покупке");
    expect(String(manager[0]?.body.text)).toContain("Новый заказ");
  });

  it("still sends the buyer receipt when the manager send succeeds first logically", async () => {
    const { send, calls } = queueSend([{ ok: true }, { ok: true }]);
    await notifyOrder({
      ...base,
      order: order({ chatId: 4242, username: "other" }),
      username: "other",
      send,
    });

    const buyerCalls = calls.filter((item) => item.body.chat_id === 4242);
    const managerCalls = calls.filter((item) => item.body.chat_id === 1557402625);
    expect(buyerCalls.length).toBeGreaterThanOrEqual(1);
    expect(managerCalls).toHaveLength(1);
    expect(String(buyerCalls[0]?.body.text)).toContain("Чек о покупке");
  });

  it("does not send a manager copy to the buyer chat", async () => {
    const { send, calls } = queueSend([{ ok: true }, { ok: true }]);
    await notifyOrder({ ...base, order: order(), send });
    const receipts = calls.filter((item) =>
      String(item.body.text).includes("Чек о покупке")
    );
    expect(receipts.every((item) => item.body.chat_id === 777001)).toBe(true);
  });

  it("retries the receipt as plain text when HTML parse fails", async () => {
    const { send, calls } = queueSend([
      { ok: false, errorCode: 400, error: "can't parse entities" },
      { ok: true },
      { ok: true },
    ]);
    const result = await notifyOrder({ ...base, order: order(), send });

    expect(result.receiptOk).toBe(true);
    const plain = calls.find(
      (item) => item.body.chat_id === 777001 && item.body.parse_mode == null
    );
    expect(plain).toBeTruthy();
    expect(String(plain?.body.text)).toContain("Чек о покупке");
  });

  it("retries the receipt after Telegram flood on the buyer chat", async () => {
    const { send, calls } = queueSend([
      { ok: false, errorCode: 429, error: "Too Many Requests", retryAfter: 0 },
      { ok: true },
      { ok: true },
    ]);
    const result = await notifyOrder({ ...base, order: order(), send });

    expect(result.receiptOk).toBe(true);
    expect(calls.filter((item) => item.body.chat_id === 777001).length).toBeGreaterThanOrEqual(2);
  });

  it("opens the buyer chat and resends a plain receipt after 403", async () => {
    const { send, calls } = queueSend([
      { ok: false, errorCode: 403, error: "bot can't initiate conversation with a user" },
      { ok: true },
      { ok: true },
      { ok: true },
    ]);
    const result = await notifyOrder({ ...base, order: order(), send });

    expect(result.receiptOk).toBe(true);
    const buyer = calls.filter((item) => item.body.chat_id === 777001);
    expect(buyer.length).toBeGreaterThanOrEqual(2);
    expect(buyer.some((item) => String(item.body.text).includes("Чек о покупке"))).toBe(
      true
    );
  });

  it("reports receiptOk=false if every buyer attempt fails", async () => {
    const send: TelegramSender = async (_method, body) => {
      if (body.chat_id === 1557402625) {
        return { ok: true };
      }
      return { ok: false, errorCode: 403, error: "forbidden" };
    };
    const result = await notifyOrder({ ...base, order: order(), send });
    expect(result.receiptOk).toBe(false);
    expect(result.managerOk).toBe(true);
  });

  it("retries the receipt after a network timeout", async () => {
    const { send, calls } = queueSend([
      { ok: false, error: "timeout" },
      { ok: true },
      { ok: true },
    ]);
    const result = await notifyOrder({ ...base, order: order(), send });
    expect(result.receiptOk).toBe(true);
    expect(calls.filter((item) => item.body.chat_id === 777001).length).toBeGreaterThanOrEqual(2);
  });

  it("sends a receipt even when no manager is configured", async () => {
    const { send, calls } = queueSend([{ ok: true }]);
    const result = await notifyOrder({
      ...base,
      managerId: 0,
      order: order(),
      send,
    });
    expect(result).toEqual({ receiptOk: true, managerOk: true });
    expect(calls).toHaveLength(1);
    expect(calls[0]?.body.chat_id).toBe(777001);
  });
});

describe("receiptMessageHtml", () => {
  it("escapes buyer-controlled fields so Telegram HTML cannot break", () => {
    const html = receiptMessageHtml(
      order({
        platform: "Steam <b>",
        denomination: "логин a<c> & x",
        region: "СНГ</b>",
      })
    );
    expect(html).toContain("Steam &lt;b&gt;");
    expect(html).toContain("логин a&lt;c&gt; &amp; x");
    expect(html).toContain("СНГ&lt;/b&gt;");
    expect(html).not.toMatch(/Товар: Steam <b>/);
  });

  it("keeps a receipt for the real failing payload from production", () => {
    const html = receiptMessageHtml(
      order({
        platform: "Коды пополнения PSN",
        denomination: "1000 ₺ × 1 · СБП · бонусы",
        region: "Турция",
        priceRub: 2650,
      })
    );
    expect(html).toContain("<b>Чек о покупке</b>");
    expect(html).toContain("1000 ₺ × 1");
  });
});
