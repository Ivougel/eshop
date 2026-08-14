"use client";

import {
  getPsOffers,
  psDurations,
  type PsOffer,
} from "@/data/ps-subscriptions";
import { PlatformIcon } from "@/components/icons";
import { formatRub, priceForRegion } from "@/lib/pricing";

const tones: Record<PsOffer["tone"], string> = {
  gold: "bg-[#e8c47e] text-[#3b2a00]",
  orange: "bg-[#f3d27a] text-[#3b2a00]",
  dark: "bg-[#161616] text-[#f3d27a] ring-1 ring-[#f3d27a]/35",
  blue: "bg-[#3b1d8f] text-white",
};

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
    <div className="flex flex-col gap-5">
      <section>
        <h2 className="text-[18px] font-semibold">Подписки PS Plus</h2>
        <div className="mt-3 flex overflow-hidden rounded-2xl bg-white/[0.06] p-1">
          {psDurations.map((item) => (
            <button
              key={item.months}
              type="button"
              onClick={() => onDuration(item.months)}
              className={`flex-1 rounded-xl py-2 text-[12px] font-medium ${
                item.months === months
                  ? "bg-[#d4af6a] text-[#0a0c12]"
                  : "text-white/80"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-2.5">
          {plusOffers.map((offer) => {
            const price = priceForRegion(offer.priceRub, regionId);
            return (
              <button
                key={offer.id}
                type="button"
                onClick={() => onOffer(offer, price)}
                className="flex items-center gap-3 text-left"
              >
                <span
                  className={`flex h-[72px] w-[88px] shrink-0 flex-col items-center justify-center rounded-[14px] text-[9px] font-bold tracking-wide ${tones[offer.tone]}`}
                >
                  <PlatformIcon icon="playstation" className="h-6 w-6" />
                  <span className="mt-1">{offer.badge}</span>
                </span>
                <span>
                  <span className="block text-[22px] leading-none font-semibold">
                    {formatRub(price)}
                  </span>
                  <span className="mt-1.5 block text-[13px] text-[#8a92a8]">
                    {offer.title}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {eaOffer ? (
        <section>
          <h2 className="text-[18px] font-semibold">Подписки EA Play</h2>
          <button
            type="button"
            onClick={() =>
              onOffer(eaOffer, priceForRegion(eaOffer.priceRub, regionId))
            }
            className="mt-3 flex items-center gap-3 text-left"
          >
            <span className="flex h-[72px] w-[88px] shrink-0 items-center justify-center rounded-[14px] bg-[#3b1d8f] text-sm font-bold">
              EA
            </span>
            <span>
              <span className="block text-[22px] leading-none font-semibold">
                {formatRub(priceForRegion(eaOffer.priceRub, regionId))}
              </span>
              <span className="mt-1.5 block text-[13px] text-[#8a92a8]">
                EA Play · {psDurations.find((item) => item.months === months)?.title}
              </span>
            </span>
          </button>
        </section>
      ) : null}

      <section>
        <h2 className="text-[18px] font-semibold">Подписка GTA+</h2>
        <button
          type="button"
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
          className="mt-3 flex items-center gap-3 text-left"
        >
          <span className="flex h-[72px] w-[88px] shrink-0 items-center justify-center rounded-[14px] bg-[#1f4d2a] text-[13px] font-bold">
            GTA+
          </span>
          <span>
            <span className="block text-[22px] leading-none font-semibold">
              {formatRub(gtaPrice)}
            </span>
            <span className="mt-1.5 block text-[13px] text-[#8a92a8]">
              GTA+ · 1 месяц
            </span>
          </span>
        </button>
      </section>
    </div>
  );
}
