"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { getDenominations, type Denomination } from "@/data/denominations";
import { platforms, type Platform } from "@/data/platforms";
import { regions } from "@/data/regions";
import {
  closeMiniApp,
  getTelegramInitData,
  getTelegramUserId,
  getTelegramUsername,
} from "@/components/TelegramInit";
import { PlatformIcon, SbpIcon } from "@/components/icons";

const USERNAME_RE = /^[A-Za-z0-9_]{5,32}$/;

export function OrderWizard() {
  const [platformId, setPlatformId] = useState<string | null>(null);
  const [regionId, setRegionId] = useState<string | null>(null);
  const [denominationId, setDenominationId] = useState<string | null>(null);
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const platformRef = useRef<HTMLElement>(null);
  const regionRef = useRef<HTMLElement>(null);
  const productRef = useRef<HTMLElement>(null);
  const payRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fromTelegram = getTelegramUsername();
    if (fromTelegram) {
      setUsername(fromTelegram);
    }
  }, []);

  useEffect(() => {
    if (!platformId) {
      return;
    }
    regionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [platformId]);

  useEffect(() => {
    if (!regionId) {
      return;
    }
    productRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [regionId]);

  useEffect(() => {
    if (!denominationId) {
      return;
    }
    payRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [denominationId]);

  useEffect(() => {
    if (!success) {
      return;
    }
    const timer = window.setTimeout(() => closeMiniApp(), 2200);
    return () => window.clearTimeout(timer);
  }, [success]);

  const platform = platforms.find((item) => item.id === platformId) ?? null;
  const region = regions.find((item) => item.id === regionId) ?? null;
  const offers = useMemo(
    () => (platformId && regionId ? getDenominations(platformId, regionId) : []),
    [platformId, regionId]
  );
  const denomination =
    offers.find((item) => item.id === denominationId) ?? null;

  function selectPlatform(id: string) {
    setPlatformId(id);
    setRegionId(null);
    setDenominationId(null);
    setShowUsernameForm(false);
    setError("");
  }

  function selectRegion(id: string) {
    setRegionId(id);
    setDenominationId(null);
    setShowUsernameForm(false);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!platform || !region || !denomination) {
      return;
    }

    const telegramUsername = username.trim().replace(/^@/, "");
    if (!USERNAME_RE.test(telegramUsername)) {
      setError("Username: латиница, цифры и _, от 5 до 32 символов, без @");
      return;
    }

    setError("");
    setPending(true);

    try {
      let telegramUserId = getTelegramUserId();
      if (!telegramUserId) {
        for (let attempt = 0; attempt < 12 && !telegramUserId; attempt += 1) {
          await new Promise((resolve) => window.setTimeout(resolve, 80));
          telegramUserId = getTelegramUserId();
        }
      }

      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: platform.title,
          region: region.title,
          denomination: `${denomination.currency} ${denomination.amount}`,
          priceRub: denomination.priceRub,
          telegramUsername,
          telegramUserId,
          telegramInitData: getTelegramInitData(),
        }),
      });

      const data: { success?: boolean; error?: string } = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error ?? "Не удалось оформить заказ");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Не удалось оформить заказ");
    } finally {
      setPending(false);
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
        <div className="order-popup flex w-full max-w-xs flex-col items-center rounded-3xl bg-[#1c1c1f] px-6 py-10 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#ff9a3c] text-3xl">
            ✓
          </span>
          <p className="mt-5 text-xl font-semibold">Ваш заказ получен</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <nav className="sticky top-0 z-20 -mx-4 flex gap-2 overflow-x-auto bg-[#0e0e10]/95 px-4 py-2">
        <NavChip
          label="Платформа"
          onClick={() =>
            platformRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        />
        {platform ? (
          <NavChip
            label="Регион"
            onClick={() =>
              regionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          />
        ) : null}
        {platform && region ? (
          <NavChip
            label="Номинал"
            onClick={() =>
              productRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          />
        ) : null}
        {denomination ? (
          <NavChip
            label="Оплата"
            onClick={() =>
              payRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          />
        ) : null}
      </nav>

      <section ref={platformRef} className="scroll-mt-16">
        <h1 className="text-xl font-semibold tracking-tight">Платформа</h1>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {platforms.map((item) => (
            <PlatformCard
              key={item.id}
              platform={item}
              selected={item.id === platformId}
              onSelect={() => selectPlatform(item.id)}
            />
          ))}
        </div>
      </section>

      {platform ? (
        <section ref={regionRef} className="scroll-mt-16">
          <h2 className="text-lg font-semibold">Регион</h2>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {regions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectRegion(item.id)}
                className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium ${
                  item.id === regionId
                    ? "bg-gradient-to-r from-[#ff4d6d] to-[#ff9a3c] text-white"
                    : "bg-[#1c1c1f] text-white/90"
                }`}
              >
                <span className="mr-1.5">{item.flagIcon}</span>
                {item.title}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {platform && region ? (
        <>
          <section ref={productRef} className="scroll-mt-16">
            <h2 className="text-lg font-semibold">Тип товара</h2>
            <div className="mt-3">
              <span className="inline-flex rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#ff9a3c] px-4 py-2 text-sm font-medium text-white">
                Подарочная карта
              </span>
            </div>
          </section>

          <section className="scroll-mt-16">
            <h2 className="text-lg font-semibold">Номинал</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {offers.map((item) => (
                <DenominationCard
                  key={item.id}
                  item={item}
                  selected={item.id === denominationId}
                  onSelect={() => {
                    setDenominationId(item.id);
                    setShowUsernameForm(false);
                    setError("");
                  }}
                />
              ))}
            </div>
          </section>
        </>
      ) : null}

      {platform && region && denomination ? (
        <section ref={payRef} className="scroll-mt-16 rounded-2xl bg-[#1c1c1f] p-4">
          <div className="flex items-end justify-between gap-3">
            <p className="text-sm text-white/60">К оплате</p>
            <p className="text-2xl font-semibold tracking-tight">
              {denomination.priceRub.toLocaleString("ru-RU")} ₽
            </p>
          </div>

          {!showUsernameForm ? (
            <button
              type="button"
              onClick={() => setShowUsernameForm(true)}
              className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff4d6d] to-[#ff9a3c] px-4 text-base font-semibold text-white"
            >
              <SbpIcon className="h-7 w-7" />
              Оплатить по СБП
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4">
              <label className="block">
                <span className="mb-1.5 block text-sm text-white/70">
                  Ваш Telegram username
                </span>
                <input
                  type="text"
                  name="telegramUsername"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value.replace(/^@/, ""))
                  }
                  placeholder="username"
                  autoComplete="username"
                  required
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#0e0e10] px-3 text-base outline-none focus:border-[#ff9a3c]"
                />
              </label>
              {error ? (
                <p className="mt-2 text-sm text-[#ff4d6d]" role="alert">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={pending}
                className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#ff4d6d] to-[#ff9a3c] text-base font-semibold text-white disabled:opacity-60"
              >
                {pending ? "Отправка…" : "Отправить заявку"}
              </button>
            </form>
          )}

          <p className="mt-4 text-center text-[11px] leading-4 text-white/40">
            Нажимая кнопку, вы принимаете{" "}
            <a href="#" className="underline">
              Пользовательское соглашение
            </a>{" "}
            и{" "}
            <a href="#" className="underline">
              Политику конфиденциальности
            </a>
          </p>
        </section>
      ) : null}
    </div>
  );
}

function NavChip({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-full bg-[#1c1c1f] px-3 py-1.5 text-xs font-medium text-white/80"
    >
      {label}
    </button>
  );
}

function PlatformCard({
  platform,
  selected,
  onSelect,
}: {
  platform: Platform;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col items-center gap-3 rounded-2xl bg-[#1c1c1f] px-3 py-5 ${
        selected ? "ring-2 ring-[#ff9a3c]" : ""
      }`}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2a2a2e] text-white">
        <PlatformIcon icon={platform.icon} className="h-8 w-8" />
      </span>
      <span className="text-sm font-medium">{platform.title}</span>
    </button>
  );
}

function DenominationCard({
  item,
  selected,
  onSelect,
}: {
  item: Denomination;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative rounded-2xl bg-[#1c1c1f] px-3 py-4 text-left ${
        selected ? "ring-2 ring-[#ff9a3c]" : ""
      }`}
    >
      <span className="absolute top-2 right-2 rounded-full bg-[#2a2a2e] px-2 py-0.5 text-[10px] text-white/70">
        Осталось: {item.stockLeft}
      </span>
      <span className="mt-4 block text-lg font-semibold">
        {item.currency} {item.amount}
      </span>
      <span className="mt-1 block text-sm text-white/50">
        {item.priceRub.toLocaleString("ru-RU")} ₽
      </span>
    </button>
  );
}
