"use client";

import { useEffect, useState } from "react";
import { PlatformIcon } from "@/components/icons";
import {
  OrderSuccess,
  PayButton,
  PaymentMethods,
  PromoRows,
  ServiceNav,
  SummaryCard,
  type ExtraKind,
  type PayMethod,
} from "@/components/shop/ShopChrome";
import { getTelegramUsername } from "@/components/TelegramInit";
import { getAiPlans, type AiService } from "@/data/ai";
import { submitOrder } from "@/lib/submit-order";

const USERNAME_RE = /^[A-Za-z0-9_]{5,32}$/;

type Props = {
  onHome: () => void;
  onFavorites: () => void;
  onCart: () => void;
  onProfile: () => void;
};

export function AiShop({ onHome, onFavorites, onCart, onProfile }: Props) {
  const [service, setService] = useState<AiService>("chatgpt");
  const [planId, setPlanId] = useState("gpt-plus");
  const [extra, setExtra] = useState<ExtraKind>("none");
  const [promo, setPromo] = useState("");
  const [method, setMethod] = useState<PayMethod>("sbp");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fromTelegram = getTelegramUsername();
    if (fromTelegram) {
      setUsername(fromTelegram);
    }
  }, []);

  const plans = getAiPlans(service);
  const plan = plans.find((item) => item.id === planId) ?? plans[0];
  const bonus = extra === "bonus" ? Math.min(50, plan.priceRub) : 0;
  const total = plan.priceRub - bonus;

  function selectService(next: AiService) {
    setService(next);
    const first = getAiPlans(next)[0];
    setPlanId(first.id);
  }

  async function pay() {
    const telegramUsername = username.trim().replace(/^@/, "");
    if (!USERNAME_RE.test(telegramUsername)) {
      setError("Username: латиница, цифры и _, от 5 до 32 символов");
      return;
    }
    setError("");
    setPending(true);
    const result = await submitOrder({
      platform: "Нейросети",
      region: service === "chatgpt" ? "ChatGPT" : "Claude",
      denomination: `${plan.title} · 1 месяц · ${method === "sbp" ? "СБП" : "крипта"}${
        extra === "bonus" ? " · бонусы" : ""
      }${extra === "promo" && promo ? ` · промо ${promo}` : ""}`,
      priceRub: total,
      telegramUsername,
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error ?? "Не удалось оформить заказ");
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return <OrderSuccess />;
  }

  return (
    <div className="relative min-h-dvh bg-[#08090c] pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#142042_0%,#08090c_55%)]" />
      <div className="relative z-10 flex flex-col gap-5 px-[18px] pt-4">
        <p className="text-center text-[12px] text-[#8a92a8]">Нейросети</p>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
              <PlatformIcon icon="ai" className="h-7 w-7" />
            </span>
            <span className="rounded-full bg-[#3b82f6] px-2 py-0.5 text-[10px] font-bold">
              AI
            </span>
          </div>
          <h1 className="mt-3 text-[22px] font-bold">Подписки на нейросети</h1>
        </div>
        <p className="text-[13px] leading-5 text-[#8a92a8]">
          Оформим подписку ChatGPT или Claude на месяц. Доступ активируем сразу
          после оплаты.
        </p>

        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[#8a92a8] uppercase">
            Сервис
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => selectService("chatgpt")}
              className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium ${
                service === "chatgpt"
                  ? "bg-[#107c10]/20 ring-1 ring-[#22c55e]"
                  : "bg-white/[0.04] ring-1 ring-white/10"
              }`}
            >
              <PlatformIcon icon="ai" className="h-4 w-4" />
              ChatGPT
            </button>
            <button
              type="button"
              onClick={() => selectService("claude")}
              className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium ${
                service === "claude"
                  ? "bg-[#c2410c]/20 ring-1 ring-[#fb923c]"
                  : "bg-white/[0.04] ring-1 ring-white/10"
              }`}
            >
              <PlatformIcon icon="claude" className="h-4 w-4 text-[#fb923c]" />
              Claude
            </button>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[#8a92a8] uppercase">
            Выберите тариф
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {plans.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPlanId(item.id)}
                className={`flex items-start justify-between gap-3 rounded-2xl bg-[#12141c] p-4 text-left ${
                  item.id === plan.id
                    ? "ring-1 ring-[#3b82f6]"
                    : "ring-1 ring-white/10"
                }`}
              >
                <span>
                  <span className="block text-[16px] font-semibold">{item.title}</span>
                  <span className="mt-1 block text-[12px] leading-4 text-[#8a92a8]">
                    {item.description}
                  </span>
                </span>
                <span className="shrink-0 text-[16px] font-semibold">
                  {item.priceRub.toLocaleString("ru-RU")} ₽
                </span>
              </button>
            ))}
          </div>
        </div>

        <PromoRows extra={extra} onExtra={setExtra} promo={promo} onPromo={setPromo} />
        <SummaryCard
          line={`${plan.title} · 1 месяц`}
          linePrice={plan.priceRub}
          total={total}
        />
        <PaymentMethods method={method} onMethod={setMethod} />
        <label className="block">
          <span className="mb-1.5 block text-sm text-white/70">Telegram username</span>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value.replace(/^@/, ""))}
            placeholder="username"
            className="h-12 w-full rounded-xl border border-white/10 bg-[#08090c] px-3 text-base outline-none focus:border-[#3b82f6]"
          />
          {error ? (
            <p className="mt-2 text-sm text-[#ff5a5a]" role="alert">
              {error}
            </p>
          ) : null}
        </label>
        <PayButton
          enabled
          pending={pending}
          label={`Оплатить · ${total.toLocaleString("ru-RU")} ₽`}
          onClick={() => void pay()}
        />
        <p className="text-center text-[11px] leading-4 text-[#8a92a8]">
          После оплаты вы получите номер заказа — оформим подписку в течение 5–15
          минут.
        </p>
      </div>
      <ServiceNav
        active="ai"
        brand="ai"
        onHome={onHome}
        onFavorites={onFavorites}
        onCart={onCart}
        onProfile={onProfile}
        onFifth={() => undefined}
      />
    </div>
  );
}
