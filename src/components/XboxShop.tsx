"use client";

import { useEffect, useState } from "react";
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
import { perMonth, xboxPlans, type XboxAccountKind } from "@/data/xbox";
import { submitOrder } from "@/lib/submit-order";

const USERNAME_RE = /^[A-Za-z0-9_]{5,32}$/;

type Props = {
  onHome: () => void;
  onFavorites: () => void;
  onCart: () => void;
  onProfile: () => void;
};

export function XboxShop({ onHome, onFavorites, onCart, onProfile }: Props) {
  const [account, setAccount] = useState<XboxAccountKind>("new");
  const [planId, setPlanId] = useState(xboxPlans[0].id);
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

  const plan = xboxPlans.find((item) => item.id === planId) ?? xboxPlans[0];
  const bonus = extra === "bonus" ? Math.min(50, plan.priceRub) : 0;
  const total = plan.priceRub - bonus;
  const accountLabel = account === "new" ? "новый аккаунт" : "свой аккаунт";
  const line = `Game Pass Ultimate · ${plan.title}`;

  async function pay() {
    const telegramUsername = username.trim().replace(/^@/, "");
    if (!USERNAME_RE.test(telegramUsername)) {
      setError("Username: латиница, цифры и _, от 5 до 32 символов");
      return;
    }
    setError("");
    setPending(true);
    const result = await submitOrder({
      platform: "Xbox Game Pass",
      region: accountLabel,
      denomination: `${line} · ${method === "sbp" ? "СБП" : "крипта"}${
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
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[#8a92a8] uppercase">
            Тип аккаунта
          </p>
          <div className="mt-2 grid grid-cols-2 overflow-hidden rounded-2xl bg-white/[0.06] p-1">
            <button
              type="button"
              onClick={() => setAccount("new")}
              className={`rounded-xl py-2.5 text-sm font-medium ${
                account === "new" ? "bg-[#3b82f6] text-white" : "text-[#8a92a8]"
              }`}
            >
              Новый аккаунт
            </button>
            <button
              type="button"
              onClick={() => setAccount("own")}
              className={`rounded-xl py-2.5 text-sm font-medium ${
                account === "own" ? "bg-[#3b82f6] text-white" : "text-[#8a92a8]"
              }`}
            >
              На свой аккаунт
            </button>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[#8a92a8] uppercase">
            Срок подписки
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {xboxPlans.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPlanId(item.id)}
                className={`flex items-center justify-between rounded-2xl bg-[#12141c] px-4 py-3 text-left ${
                  item.id === planId ? "ring-1 ring-[#3b82f6]" : "ring-1 ring-white/8"
                }`}
              >
                <span>
                  <span className="block text-[15px] font-semibold">{item.title}</span>
                  <span className="mt-0.5 block text-[12px] text-[#8a92a8]">
                    ≈ {perMonth(item).toLocaleString("ru-RU")} ₽/мес
                  </span>
                </span>
                <span className="text-[15px] font-semibold">
                  {item.priceRub.toLocaleString("ru-RU")} ₽
                </span>
              </button>
            ))}
          </div>
        </div>

        <PromoRows extra={extra} onExtra={setExtra} promo={promo} onPromo={setPromo} />
        <SummaryCard line={line} linePrice={plan.priceRub} total={total} />
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
      </div>
      <ServiceNav
        active="xbox"
        onHome={onHome}
        onFavorites={onFavorites}
        onCart={onCart}
        onProfile={onProfile}
        onFifth={() => undefined}
      />
    </div>
  );
}
