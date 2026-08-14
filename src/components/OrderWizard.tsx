"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getDenominations, type Denomination } from "@/data/denominations";
import { getPlanOffers, type PlanOffer } from "@/data/plans";
import { regions } from "@/data/regions";
import type { ShopEntry } from "@/data/home";
import { OrderSuccess } from "@/components/shop/ShopChrome";
import { SbpIcon } from "@/components/icons";
import { submitOrder, type CreatedOrder } from "@/lib/submit-order";

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
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState<CreatedOrder | null>(null);

  const regionRef = useRef<HTMLElement>(null);
  const productRef = useRef<HTMLElement>(null);
  const payRef = useRef<HTMLElement>(null);

  const lockRegion = Boolean(entry.regionId);
  const needsRegion = entry.kind !== "plans";

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
    setError("");
  }

  async function pay() {
    if (!region || !selected) {
      return;
    }

    setError("");
    setPending(true);
    const result = await submitOrder({
      platform: entry.platformTitle,
      region: region.title,
      denomination: selected.label,
      priceRub: selected.priceRub,
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

        {error ? (
          <p className="mt-3 text-sm text-[#ff4d6d]" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="button"
          disabled={pending}
          onClick={() => void pay()}
          className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff4d6d] to-[#ff9a3c] px-4 text-base font-semibold text-white disabled:opacity-60"
        >
          <SbpIcon className="h-7 w-7" />
          {pending ? "Отправка…" : "Оплатить по СБП"}
        </button>

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
