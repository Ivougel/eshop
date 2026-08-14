"use client";

import { useMemo, useRef, useState } from "react";
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
import { getPsnOffers, getPsnRegion, psnRegions } from "@/data/psn";
import { submitOrder, type CreatedOrder } from "@/lib/submit-order";

type Props = {
  onHome: () => void;
  onFavorites: () => void;
  onCart: () => void;
  onProfile: () => void;
  onSubscriptions: () => void;
};

export function PsnShop({
  onHome,
  onFavorites,
  onCart,
  onProfile,
  onSubscriptions,
}: Props) {
  const [regionId, setRegionId] = useState("tr");
  const [qty, setQty] = useState<Record<string, number>>({});
  const [needAccount, setNeedAccount] = useState(false);
  const [extra, setExtra] = useState<ExtraKind>("none");
  const [promo, setPromo] = useState("");
  const [method, setMethod] = useState<PayMethod>("sbp");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState<CreatedOrder | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  const region = getPsnRegion(regionId) ?? psnRegions[0];
  const offers = getPsnOffers(region.id);
  const selected = useMemo(
    () =>
      offers
        .map((item) => ({ item, count: qty[item.id] ?? 0 }))
        .filter((row) => row.count > 0),
    [offers, qty]
  );
  const subtotal = selected.reduce(
    (sum, row) => sum + row.item.priceRub * row.count,
    0
  );
  const bonus = extra === "bonus" ? Math.min(50, subtotal) : 0;
  const total = subtotal - bonus;
  const line =
    selected.length === 0
      ? "Выберите номинал"
      : selected
          .map((row) => `${row.item.amount} ${row.item.symbol} × ${row.count}`)
          .join(", ");

  function setCount(id: string, next: number) {
    setQty((current) => ({ ...current, [id]: Math.max(0, next) }));
  }

  async function pay() {
    if (selected.length === 0) {
      return;
    }
    setError("");
    setPending(true);
    const result = await submitOrder({
      platform: "Коды пополнения PSN",
      region: region.title,
      denomination: `${line} · ${method === "sbp" ? "СБП" : "крипта"}${
        needAccount ? " · нужен аккаунт" : ""
      }${extra === "bonus" ? " · бонусы" : ""}${
        extra === "promo" && promo ? ` · промо ${promo}` : ""
      }`,
      priceRub: total,
    });
    setPending(false);
    if (!result.ok || !result.order) {
      setError(result.error ?? "Не удалось оформить заказ");
      return;
    }
    setCreated(result.order);
  }

  if (created) {
    return <OrderSuccess orderId={created.orderId} onDone={onHome} />;
  }

  return (
    <div className="relative min-h-dvh bg-[#08090c] pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#142042_0%,#08090c_55%)]" />
      <div className="relative z-10 flex flex-col gap-5 px-[18px] pt-4">
        <p className="text-[11px] text-[#8a92a8]">Магазин | PSN</p>
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00439c] text-white">
            <PlatformIcon icon="playstation" className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-[22px] font-bold leading-tight">
              Коды пополнения <span className="text-[#3b82f6]">PSN</span>
            </h1>
            <p className="mt-0.5 text-[13px] text-[#8a92a8]">
              Пополните кошелёк PlayStation Store
            </p>
          </div>
        </div>

        <div
          ref={regionRef}
          className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {psnRegions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setRegionId(item.id);
                setQty({});
              }}
              className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium ${
                item.id === region.id
                  ? "ring-1 ring-[#3b82f6] text-white"
                  : "bg-white/[0.05] text-[#8a92a8]"
              }`}
            >
              <span className="mr-1.5">{item.flagIcon}</span>
              {item.title}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {offers.map((item) => {
            const count = qty[item.id] ?? 0;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#12141c] px-4 py-3"
              >
                <div>
                  <p className="text-[20px] font-semibold">
                    {item.amount} {item.symbol}
                  </p>
                  <p className="text-[13px] text-[#8a92a8]">
                    {item.priceRub.toLocaleString("ru-RU")} ₽
                  </p>
                </div>
                <div className="flex items-center gap-3 rounded-full bg-[#152238] px-3 py-1.5 text-[#60a5fa]">
                  <button
                    type="button"
                    onClick={() => setCount(item.id, count - 1)}
                    className="text-lg leading-none"
                  >
                    −
                  </button>
                  <span className="min-w-4 text-center text-sm text-white">
                    {count}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCount(item.id, count + 1)}
                    className="text-lg leading-none"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {region.id === "tr" ? (
          <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
            <p className="text-sm">
              <span className="mr-2">🇹🇷</span>
              Нужен турецкий аккаунт
            </p>
            <button
              type="button"
              role="switch"
              aria-checked={needAccount}
              onClick={() => setNeedAccount((value) => !value)}
              className={`relative h-6 w-11 rounded-full ${
                needAccount ? "bg-[#3b82f6]" : "bg-white/15"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-[left] ${
                  needAccount ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onSubscriptions}
          className="flex items-center justify-between rounded-2xl border border-[#d4af6a]/50 px-4 py-3 text-left"
        >
          <span className="text-[13px] leading-5 text-[#cfd3dc]">
            Оплатить подписку с баланса самостоятельно не получится. Если нужна
            подписка —{" "}
            <span className="text-[#d4af6a]">оформите её здесь</span>
          </span>
          <span className="ml-3 text-[#d4af6a]">›</span>
        </button>

        <PromoRows extra={extra} onExtra={setExtra} promo={promo} onPromo={setPromo} />
        <SummaryCard
          line={line}
          linePrice={selected.length === 0 ? null : subtotal}
          total={total}
        />
        <PaymentMethods method={method} onMethod={setMethod} />
        {error ? (
          <p className="text-sm text-[#ff5a5a]" role="alert">
            {error}
          </p>
        ) : null}
        <PayButton
          enabled={selected.length > 0}
          pending={pending}
          label={
            selected.length === 0
              ? "Выберите номинал"
              : `Оплатить · ${total.toLocaleString("ru-RU")} ₽`
          }
          onClick={() => void pay()}
        />
      </div>
      <ServiceNav
        active="region"
        regionFlag={region.flagIcon}
        regionCode={region.code}
        onHome={onHome}
        onFavorites={onFavorites}
        onCart={onCart}
        onProfile={onProfile}
        onFifth={() =>
          regionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      />
    </div>
  );
}
