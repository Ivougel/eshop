"use client";

import { useMemo, useState } from "react";
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
import { robloxGuide, robloxOffers } from "@/data/roblox";
import { submitOrder, type CreatedOrder } from "@/lib/submit-order";

type Props = {
  onHome: () => void;
  onFavorites: () => void;
  onCart: () => void;
  onProfile: () => void;
};

export function RobloxShop({ onHome, onFavorites, onCart, onProfile }: Props) {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [extra, setExtra] = useState<ExtraKind>("none");
  const [promo, setPromo] = useState("");
  const [method, setMethod] = useState<PayMethod>("sbp");
  const [guideOpen, setGuideOpen] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState<CreatedOrder | null>(null);

  const selected = useMemo(
    () =>
      robloxOffers
        .map((item) => ({ item, count: qty[item.id] ?? 0 }))
        .filter((row) => row.count > 0 && row.item.inStock),
    [qty]
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
      : selected.map((row) => `${row.item.amount} Robux × ${row.count}`).join(", ");

  async function pay() {
    if (selected.length === 0) {
      return;
    }
    setError("");
    setPending(true);
    const result = await submitOrder({
      platform: "Roblox",
      region: "Глобальный",
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
    return <OrderSuccess orderId={created.orderId} onDone={onHome} />;
  }

  return (
    <div className="relative min-h-dvh bg-[#08090c] pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#142042_0%,#08090c_55%)]" />
      <div className="relative z-10 flex flex-col gap-5 px-[18px] pt-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e2231a] text-white">
            <PlatformIcon icon="roblox" className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-[22px] font-bold leading-tight">
              Roblox <span className="text-[#7eb8f7]">Robux</span>
            </h1>
            <p className="mt-0.5 text-[13px] text-[#8a92a8]">
              Глобальные коды, подходят для аккаунта любого региона
            </p>
          </div>
        </div>

        <p className="text-[15px] font-semibold">Выберите номиналы</p>
        <div className="flex flex-col gap-2">
          {robloxOffers.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between rounded-2xl border border-white/10 bg-[#12141c] px-4 py-3 ${
                item.inStock ? "" : "opacity-50"
              }`}
            >
              <div>
                <p className="text-[16px] font-semibold">{item.amount} Robux</p>
                <p
                  className={`text-[13px] ${
                    item.inStock ? "text-[#8a92a8]" : "text-[#ff5a5a]"
                  }`}
                >
                  {item.inStock
                    ? `${item.priceRub.toLocaleString("ru-RU")} ₽`
                    : "Нет в наличии"}
                </p>
              </div>
              <QtyStepper
                value={qty[item.id] ?? 0}
                disabled={!item.inStock}
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
            Как активировать код Robux
            <span className="text-[#60a5fa]">{guideOpen ? "⌃" : "⌄"}</span>
          </button>
          {guideOpen ? (
            <div className="px-4 pb-3">
              <GuideSteps steps={robloxGuide} />
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
        active="roblox"
        brand="roblox"
        onHome={onHome}
        onFavorites={onFavorites}
        onCart={onCart}
        onProfile={onProfile}
        onFifth={() => undefined}
      />
    </div>
  );
}
