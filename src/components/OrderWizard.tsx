"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { getDenominations, type Denomination } from "@/data/denominations";
import { getPlanOffers, type PlanOffer } from "@/data/plans";
import { regions } from "@/data/regions";
import type { ShopEntry } from "@/data/home";
import {
  closeMiniApp,
  getTelegramInitData,
  getTelegramUserId,
  getTelegramUsername,
} from "@/components/TelegramInit";
import { SbpIcon } from "@/components/icons";

const USERNAME_RE = /^[A-Za-z0-9_]{5,32}$/;

export function OrderWizard({
  entry,
  onBack,
}: {
  entry: ShopEntry;
  onBack: () => void;
}) {
  const [regionId, setRegionId] = useState<string | null>(
    entry.kind === "plans" ? "any" : (entry.regionId ?? null)
  );
  const [denominationId, setDenominationId] = useState<string | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const regionRef = useRef<HTMLElement>(null);
  const productRef = useRef<HTMLElement>(null);
  const payRef = useRef<HTMLElement>(null);

  const lockRegion = Boolean(entry.regionId);
  const needsRegion = entry.kind !== "plans";

  useEffect(() => {
    const fromTelegram = getTelegramUsername();
    if (fromTelegram) {
      setUsername(fromTelegram);
    }
  }, []);

  useEffect(() => {
    if (!regionId || lockRegion || !needsRegion) {
      return;
    }
    productRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [regionId, lockRegion, needsRegion]);

  useEffect(() => {
    if (!denominationId && !planId) {
      return;
    }
    payRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [denominationId, planId]);

  useEffect(() => {
    if (!success) {
      return;
    }
    const timer = window.setTimeout(() => closeMiniApp(), 2200);
    return () => window.clearTimeout(timer);
  }, [success]);

  const availableRegions = entry.regionIds
    ? regions.filter((item) => entry.regionIds?.includes(item.id))
    : regions;
  const region =
    entry.kind === "plans"
      ? { id: "any", title: "—" }
      : (availableRegions.find((item) => item.id === regionId) ?? null);
  const offers = useMemo(
    () =>
      entry.kind === "cards" && regionId
        ? getDenominations(entry.platformId, regionId)
        : [],
    [entry.kind, entry.platformId, regionId]
  );
  const denomination =
    offers.find((item) => item.id === denominationId) ?? null;
  const plans = entry.kind === "plans" ? getPlanOffers(entry.platformId) : [];
  const plan = plans.find((item) => item.id === planId) ?? null;
  const selected =
    entry.kind === "plans"
      ? plan
        ? { label: plan.title, priceRub: plan.priceRub }
        : null
      : denomination
        ? {
            label: `${denomination.currency} ${denomination.amount}`,
            priceRub: denomination.priceRub,
          }
        : null;
  const productReady = entry.kind === "plans" || Boolean(region);

  function selectRegion(id: string) {
    setRegionId(id);
    setDenominationId(null);
    setPlanId(null);
    setShowUsernameForm(false);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!region || !selected) {
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
          platform: entry.platformTitle,
          region: region.title,
          denomination: selected.label,
          priceRub: selected.priceRub,
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

  const productLabel = entry.kind === "plans" ? "Тариф" : "Номинал";

  return (
    <div className="flex flex-col gap-7">
      <nav className="sticky top-0 z-20 -mx-4 flex gap-2 overflow-x-auto bg-[#0e0e10]/95 px-4 py-2">
        <NavChip label="← Меню" onClick={onBack} />
        {needsRegion && !lockRegion ? (
          <NavChip
            label="Регион"
            onClick={() =>
              regionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          />
        ) : null}
        {productReady ? (
          <NavChip
            label={productLabel}
            onClick={() =>
              productRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          />
        ) : null}
        {selected ? (
          <NavChip
            label="Оплата"
            onClick={() =>
              payRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          />
        ) : null}
      </nav>

      <p className="text-sm text-white/50">{entry.platformTitle}</p>

      {needsRegion && !lockRegion ? (
        <section ref={regionRef} className="scroll-mt-16">
          <h2 className="text-lg font-semibold">Регион</h2>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {availableRegions.map((item) => (
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

      {productReady ? (
        <section ref={productRef} className="scroll-mt-16">
          {entry.kind === "plans" ? (
            <>
              <h2 className="text-lg font-semibold">Тариф</h2>
              <div className="mt-3 flex flex-col gap-2">
                {plans.map((item) => (
                  <PlanCard
                    key={item.id}
                    item={item}
                    selected={item.id === planId}
                    onSelect={() => {
                      setPlanId(item.id);
                      setShowUsernameForm(false);
                      setError("");
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold">Тип товара</h2>
              <div className="mt-3">
                <span className="inline-flex rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#ff9a3c] px-4 py-2 text-sm font-medium text-white">
                  Подарочная карта
                </span>
              </div>
              <h2 className="mt-6 text-lg font-semibold">Номинал</h2>
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
            </>
          )}
        </section>
      ) : null}

      {productReady && selected ? (
        <section ref={payRef} className="scroll-mt-16 rounded-2xl bg-[#1c1c1f] p-4">
          <div className="flex items-end justify-between gap-3">
            <p className="text-sm text-white/60">К оплате</p>
            <p className="text-2xl font-semibold tracking-tight">
              {selected.priceRub.toLocaleString("ru-RU")} ₽
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

function PlanCard({
  item,
  selected,
  onSelect,
}: {
  item: PlanOffer;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-center justify-between gap-3 rounded-2xl bg-[#1c1c1f] p-4 text-left ${
        selected ? "ring-2 ring-[#ff9a3c]" : ""
      }`}
    >
      <span className="text-base font-medium">{item.title}</span>
      <span className="shrink-0 text-base font-semibold">
        {item.priceRub.toLocaleString("ru-RU")} ₽
      </span>
    </button>
  );
}
