"use client";

import { useState } from "react";
import {
  ChevronIcon,
  NavCartIcon,
  PlatformIcon,
} from "@/components/icons";
import {
  OrderSuccess,
  PaymentMethods,
  ServiceNav,
  type PayMethod,
} from "@/components/shop/ShopChrome";
import { submitOrder, type CreatedOrder } from "@/lib/submit-order";
import {
  STEAM_COMMISSION,
  STEAM_KZT_RATE,
  STEAM_MIN_AMOUNT,
  STEAM_PRESETS,
  steamFaq,
} from "@/data/steam";

const STEAM_LOGIN_RE = /^[A-Za-z0-9_]{3,32}$/;
const GOLD = "#d4af6a";

type Props = {
  onHome: () => void;
  onFavorites: () => void;
  onCart: () => void;
  onProfile: () => void;
};

export function SteamShop({ onHome, onFavorites, onCart, onProfile }: Props) {
  const [login, setLogin] = useState("");
  const [amount, setAmount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [method, setMethod] = useState<PayMethod>("sbp");
  const [openGuide, setOpenGuide] = useState(false);
  const [openFaq, setOpenFaq] = useState(false);
  const [openFaqItem, setOpenFaqItem] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState<CreatedOrder | null>(null);

  const payAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;
  const receiveAmount = Math.round(payAmount * (1 - STEAM_COMMISSION));
  const kzt = Math.round(payAmount * STEAM_KZT_RATE);
  const canPay = payAmount >= STEAM_MIN_AMOUNT && STEAM_LOGIN_RE.test(login.trim());

  function step(delta: number) {
    setAmount((current) => Math.max(0, current + delta));
  }

  async function pay() {
    if (!canPay) {
      setError("Укажите логин Steam и сумму от 10 ₽");
      return;
    }
    setError("");
    setPending(true);
    const result = await submitOrder({
      platform: "Steam",
      region: "СНГ",
      denomination: `логин ${login.trim()} · ${payAmount} ₽ · зачисление ~${receiveAmount} ₽ · ${
        method === "sbp" ? "СБП" : "крипта"
      }`,
      priceRub: payAmount,
    });
    setPending(false);
    if (!result.ok || !result.order) {
      setError(result.error ?? "Не удалось оформить заказ");
      return;
    }
    setCreated(result.order);
  }

  if (created) {
    return <OrderSuccess orderId={created.orderId} />;
  }

  return (
    <div className="relative min-h-dvh bg-[#08090c] pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#142042_0%,#08090c_55%)]" />
      <div className="relative z-10 flex flex-col gap-5 px-[18px] pt-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1b2838] text-white">
            <PlatformIcon icon="steam" className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-[22px] font-bold leading-tight">
              Пополни баланс <span className="text-[#7eb8f7]">Steam</span>
            </h1>
            <p className="mt-0.5 text-[13px] text-[#8a92a8]">
              для России и стран СНГ
            </p>
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Логин в Steam</span>
          <span className="relative block">
            <input
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              placeholder="Логин в Steam"
              className="h-12 w-full rounded-xl border bg-[#0c0e14] px-3 pr-28 text-base outline-none"
              style={{ borderColor: GOLD }}
            />
            <button
              type="button"
              onClick={() => setShowHint((value) => !value)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[13px] text-[#60a5fa]"
            >
              Где найти?
            </button>
          </span>
          {showHint ? (
            <p className="mt-2 text-[12px] leading-4 text-[#8a92a8]">
              Steam → профиль → название аккаунта. Нужен логин, не ник и не email.
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Сумма</span>
          <span className="flex h-12 overflow-hidden rounded-xl border" style={{ borderColor: GOLD }}>
            <span className="flex flex-col justify-center border-r border-[#d4af6a]/40 px-2 text-[#d4af6a]">
              <button type="button" onClick={() => step(10)} className="leading-none">
                ▲
              </button>
              <button type="button" onClick={() => step(-10)} className="leading-none">
                ▼
              </button>
            </span>
            <input
              type="number"
              min={0}
              value={payAmount || ""}
              onChange={(event) => setAmount(Number(event.target.value) || 0)}
              placeholder="0"
              className="min-w-0 flex-1 bg-[#0c0e14] px-3 text-base outline-none"
            />
            <span className="flex items-center bg-[#d4af6a]/15 px-3 font-semibold text-[#d4af6a]">
              ₽
            </span>
          </span>
        </label>

        <div className="grid grid-cols-4 gap-2">
          {STEAM_PRESETS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setAmount(value)}
              className={`h-10 rounded-xl text-sm ${
                payAmount === value
                  ? "bg-[#d4af6a]/20 text-[#d4af6a] ring-1 ring-[#d4af6a]"
                  : "bg-white/[0.06] text-[#cfd3dc]"
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border px-4 py-3" style={{ borderColor: GOLD }}>
          <p className="text-[13px]">
            <span className="mr-2">🇰🇿</span>
            Казахстан
          </p>
          <p className="mt-1 text-[15px] font-semibold text-[#d4af6a]">
            ≈ {kzt.toLocaleString("ru-RU")} ₸
          </p>
        </div>

        <div className="flex gap-2">
          {["Мгновенно", "5%", "24/7"].map((item) => (
            <span
              key={item}
              className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white/[0.06] py-1.5 text-[11px] text-[#cfd3dc]"
            >
              <span className="text-[#22c55e]">✓</span>
              {item}
            </span>
          ))}
        </div>

        <div>
          <h2 className="mb-2 text-base font-semibold">Способы оплаты</h2>
          <PaymentMethods method={method} onMethod={setMethod} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-[#d4af6a] uppercase">
            Итог
          </p>
          <div className="mt-3 flex justify-between text-sm text-[#8a92a8]">
            <span>Вы платите:</span>
            <span>{payAmount.toLocaleString("ru-RU")} ₽</span>
          </div>
          <div className="mt-1.5 flex justify-between text-sm text-[#8a92a8]">
            <span>Наша комиссия:</span>
            <span>5%</span>
          </div>
          <div className="mt-3 border-t border-white/10 pt-3 flex justify-between">
            <span>Вы получите:</span>
            <span className="text-lg font-semibold text-[#d4af6a]">
              ~{receiveAmount.toLocaleString("ru-RU")} ₽
            </span>
          </div>
        </div>

        <button
          type="button"
          disabled={!canPay || pending}
          onClick={() => void pay()}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#22c55e] text-base font-semibold text-white disabled:bg-[#1f3d1c] disabled:text-[#7aa56f]"
        >
          <NavCartIcon className="h-5 w-5" />
          {pending ? "Отправка…" : "Оплатить"}
        </button>
        <p className="text-center text-[11px] text-[#8a92a8]">
          Мин. сумма {STEAM_MIN_AMOUNT} ₽ · Зачисление ~5 сек
        </p>
        {error ? (
          <p className="text-center text-sm text-[#ff5a5a]" role="alert">
            {error}
          </p>
        ) : null}

        <Accordion
          title="Инструкция"
          open={openGuide}
          onToggle={() => setOpenGuide((value) => !value)}
        >
          <ol className="divide-y divide-white/10">
            {[
              {
                t: (
                  <>
                    Введите <b>логин</b> вашего аккаунта.
                  </>
                ),
                d: "Нужен именно логин, не ник, имя или email.",
              },
              {
                t: (
                  <>
                    Если сомневаетесь, сделайте <b>тестовый платёж на 10 рублей</b>.
                  </>
                ),
              },
              {
                t: "Укажите сумму пополнения и нажмите «Оплатить».",
              },
              {
                t: "Мы отправим заявку в чат с ботом для завершения платежа.",
              },
              {
                t: (
                  <>
                    Если возникнут вопросы, напишите в{" "}
                    <a
                      href="https://t.me/icity_eshop_bot"
                      className="text-[#60a5fa]"
                    >
                      поддержку
                    </a>
                    .
                  </>
                ),
              },
            ].map((item, index) => (
              <li key={index} className="flex gap-3 py-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3b82f6] text-[12px] font-semibold">
                  {index + 1}
                </span>
                <span className="text-[13px] leading-5">
                  {item.t}
                  {"d" in item && item.d ? (
                    <span className="mt-1 block text-[12px] text-[#8a92a8]">
                      {item.d}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
        </Accordion>

        <Accordion
          title="Частые вопросы"
          open={openFaq}
          onToggle={() => setOpenFaq((value) => !value)}
        >
          <div className="flex flex-col gap-2">
            {steamFaq.map((item, index) => (
              <div key={item.q} className="overflow-hidden rounded-xl bg-white/[0.04]">
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaqItem((current) => (current === index ? null : index))
                  }
                  className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left text-[13px]"
                >
                  {item.q}
                  <ChevronIcon className="h-4 w-4 shrink-0 text-[#60a5fa]" />
                </button>
                {openFaqItem === index ? (
                  <p className="px-3 pb-3 text-[12px] leading-4 text-[#8a92a8]">
                    {item.a}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[12px] text-[#8a92a8]">
            Не нашли ответа на свой вопрос?
          </p>
          <a
            href="https://t.me/icity_eshop_bot"
            className="mt-1 block text-center text-[13px] text-[#60a5fa]"
          >
            Обратиться в поддержку
          </a>
        </Accordion>
      </div>

      <ServiceNav
        active="steam"
        brand="steam"
        onHome={onHome}
        onFavorites={onFavorites}
        onCart={onCart}
        onProfile={onProfile}
        onFifth={() => undefined}
      />
    </div>
  );
}

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-[15px] font-medium"
      >
        {title}
        <ChevronIcon
          className={`h-4 w-4 text-[#60a5fa] transition ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open ? <div className="px-4 pb-4">{children}</div> : null}
    </div>
  );
}
