"use client";

import { useMemo, useRef, useState } from "react";
import { PlatformIcon } from "@/components/icons";
import {
  GuideSteps,
  OrderSuccess,
  PayButton,
  PaymentMethods,
  PromoRows,
  QtyStepper,
  ServiceNav,
  SummaryCard,
  type ExtraKind,
  type PayMethod,
} from "@/components/shop/ShopChrome";
import {
  appleGuide,
  appleRegions,
  getAppleOffers,
  getAppleRegion,
} from "@/data/apple";
import { submitOrder, type CreatedOrder } from "@/lib/submit-order";

type Props = {
  onHome: () => void;
  onFavorites: () => void;
  onCart: () => void;
  onProfile: () => void;
};

export function AppStoreShop({ onHome, onFavorites, onCart, onProfile }: Props) {
  const [regionId, setRegionId] = useState("us");
  const [qty, setQty] = useState<Record<string, number>>({});
  const [extra, setExtra] = useState<ExtraKind>("none");
  const [promo, setPromo] = useState("");
  const [method, setMethod] = useState<PayMethod>("sbp");
  const [guideOpen, setGuideOpen] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState<CreatedOrder | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  const region = getAppleRegion(regionId) ?? appleRegions[0];
  const offers = getAppleOffers(region.id);
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
      ? "Выберите номиналы"
      : selected
          .map((row) => `${row.item.symbol}${row.item.amount} × ${row.count}`)
          .join(", ");

  async function pay() {
    if (selected.length === 0) {
      return;
    }
    setError("");
    setPending(true);
    const result = await submitOrder({
      platform: "App Store",
      region: region.title,
      denomination: `${line} · ${method === "sbp" ? "СБП" : "крипта"}${
        extra === "bonus" ? " · бонусы" : ""
      }${extra === "promo" && promo ? ` · промо ${promo}` : ""}`,
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
    return <OrderSuccess orderId={created.orderId} />;
  }

  return (
    <div className="relative min-h-dvh bg-[#08090c] pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#142042_0%,#08090c_55%)]" />
      <div className="relative z-10 flex flex-col gap-5 px-[18px] pt-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1c1c1e] text-white">
            <PlatformIcon icon="apple" className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-[22px] font-bold leading-tight">
              App Store <span className="text-[#7eb8f7]">Apple</span>
            </h1>
            <p className="mt-0.5 text-[13px] text-[#8a92a8]">
              Карты пополнения — выберите регион аккаунта
            </p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[15px] font-semibold">Регион аккаунта Apple</p>
          <div
            ref={regionRef}
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {appleRegions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setRegionId(item.id);
                  setQty({});
                }}
                className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium ${
                  item.id === region.id
                    ? "bg-[#152238] ring-1 ring-[#3b82f6] text-white"
                    : "bg-white/[0.05] text-[#8a92a8]"
                }`}
              >
                <span className="mr-1.5">{item.flagIcon}</span>
                {item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {offers.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#12141c] px-4 py-3"
            >
              <div>
                <p className="text-[20px] font-semibold">
                  {item.symbol}
                  {item.amount}
                </p>
                <p className="text-[13px] text-[#8a92a8]">
                  {item.priceRub.toLocaleString("ru-RU")} ₽
                </p>
              </div>
              <QtyStepper
                value={qty[item.id] ?? 0}
                onChange={(value) =>
                  setQty((current) => ({ ...current, [item.id]: value }))
                }
              />
            </div>
          ))}
        </div>

        <PromoRows extra={extra} onExtra={setExtra} promo={promo} onPromo={setPromo} />
        <SummaryCard
          line={line}
          linePrice={selected.length === 0 ? null : subtotal}
          total={total}
        />

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <button
            type="button"
            onClick={() => setGuideOpen((value) => !value)}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-[15px] font-medium"
          >
            Как активировать код App Store
            <span className="text-[#60a5fa]">{guideOpen ? "⌃" : "⌄"}</span>
          </button>
          {guideOpen ? (
            <div className="px-4 pb-3">
              <GuideSteps steps={appleGuide} />
            </div>
          ) : null}
        </div>

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
              ? "Оплатить"
              : `Оплатить · ${total.toLocaleString("ru-RU")} ₽`
          }
          onClick={() => void pay()}
        />
        <p className="text-center text-[11px] text-[#8a92a8]">
          После оплаты код придёт сюда в бот
        </p>
      </div>
      <ServiceNav
        active="apple"
        brand="apple"
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
