"use client";

import {
  getPsOffers,
  psDurations,
  type PsOffer,
} from "@/data/ps-subscriptions";
import { formatRub, priceForRegion } from "@/lib/pricing";

type Props = {
  regionId: string;
  months: number;
  onDuration: (months: number) => void;
  onOffer: (offer: PsOffer, priceRub: number) => void;
};

export function PsSubscriptions({
  regionId,
  months,
  onDuration,
  onOffer,
}: Props) {
  const plusOffers = getPsOffers("ps-plus", months);
  const eaOffer = getPsOffers("ea-play", months)[0];
  const gtaPrice = priceForRegion(855, regionId);

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="text-[18px] font-semibold">Подписки PS Plus</h2>
        <div className="mt-3 flex overflow-hidden rounded-2xl bg-white/[0.06] p-1">
          {psDurations.map((item) => (
            <button
              key={item.months}
              type="button"
              onClick={() => onDuration(item.months)}
              className={`flex-1 rounded-xl py-2.5 text-[12px] font-semibold ${
                item.months === months
                  ? "bg-gradient-to-r from-[#d4af6a] to-[#e8c47e] text-[#0a0c12]"
                  : "text-white/80"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {plusOffers.map((offer) => {
            const price = priceForRegion(offer.priceRub, regionId);
            return (
              <OfferRow
                key={offer.id}
                months={months}
                label={offer.badge}
                subtitle={offer.title}
                price={price}
                tone={offer.tone}
                onClick={() => onOffer(offer, price)}
              />
            );
          })}
        </div>
      </section>

      {eaOffer ? (
        <section>
          <h2 className="text-[18px] font-semibold">Подписки EA Play</h2>
          <div className="mt-4">
            <OfferRow
              months={months}
              label="EA PLAY"
              subtitle={`EA Play · ${psDurations.find((item) => item.months === months)?.title}`}
              price={priceForRegion(eaOffer.priceRub, regionId)}
              tone="blue"
              onClick={() =>
                onOffer(eaOffer, priceForRegion(eaOffer.priceRub, regionId))
              }
            />
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="text-[18px] font-semibold">Подписка GTA+</h2>
        <div className="mt-4">
          <OfferRow
            months={1}
            label="GTA+"
            subtitle="GTA+ · 1 месяц"
            price={gtaPrice}
            tone="green"
            onClick={() =>
              onOffer(
                {
                  id: "gta-plus",
                  catalogId: "gta-plus",
                  months: 1,
                  title: "GTA+",
                  badge: "GTA+",
                  priceRub: 855,
                  tone: "blue",
                },
                gtaPrice
              )
            }
          />
        </div>
      </section>
    </div>
  );
}

function OfferRow({
  months,
  label,
  subtitle,
  price,
  tone,
  onClick,
}: {
  months: number;
  label: string;
  subtitle: string;
  price: number;
  tone: "gold" | "orange" | "dark" | "blue" | "green";
  onClick: () => void;
}) {
  const skins: Record<typeof tone, string> = {
    gold: "bg-[#d9d9de] text-[#2b2b2f]",
    orange: "bg-gradient-to-br from-[#f0d48a] to-[#d4af6a] text-[#3b2a00]",
    dark: "bg-[#141416] text-[#f3d27a] ring-1 ring-[#f3d27a]/30",
    blue: "bg-gradient-to-br from-[#4b2ad4] to-[#2a1478] text-white",
    green: "bg-gradient-to-br from-[#1f6b38] to-[#123d22] text-white",
  };

  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-4 text-left">
      <span
        className={`relative flex h-[92px] w-[46%] max-w-[176px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] ${skins[tone]}`}
      >
        <span className="absolute right-1 -bottom-3 text-[72px] leading-none font-black opacity-20">
          {months}
        </span>
        <span className="relative text-[13px] font-extrabold tracking-[0.14em]">
          {label}
        </span>
      </span>
      <span className="min-w-0">
        <span className="block text-[24px] leading-none font-bold tracking-tight">
          {formatRub(price)}
        </span>
        <span className="mt-2 block text-[13px] text-[#8a92a8]">{subtitle}</span>
      </span>
    </button>
  );
}
