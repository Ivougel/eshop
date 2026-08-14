"use client";

import {
  eaPlayFeatures,
  getPsOffers,
  psDurations,
  psPlusFeatures,
  type PsOffer,
} from "@/data/ps-subscriptions";
import { PlatformIcon } from "@/components/icons";

const tabActive = "bg-[#d4af6a] text-[#0a0c12]";
const tabIdle = "bg-white/[0.06] text-white/80";

const tones: Record<PsOffer["tone"], string> = {
  gold: "bg-[#f3d27a] text-[#3b2a00]",
  orange: "bg-[#ff9a3c] text-[#3b1600]",
  dark: "bg-[#111113] text-[#f3d27a] ring-1 ring-[#f3d27a]/40",
  blue: "bg-[#1d4ed8] text-white",
};

type Props = {
  months: number;
  onDuration: (months: number) => void;
  onOffer: (offer: PsOffer) => void;
};

export function PsSubscriptions({ months, onDuration, onOffer }: Props) {
  const plusOffers = getPsOffers("ps-plus", months);
  const eaOffer = getPsOffers("ea-play", months)[0];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Подписки</h2>
      <div className="flex gap-2">
        {psDurations.map((item) => (
          <button
            key={item.months}
            type="button"
            onClick={() => onDuration(item.months)}
            className={`shrink-0 rounded-xl px-3.5 py-2 text-sm font-medium ${
              item.months === months ? tabActive : tabIdle
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <p className="text-[12px] font-semibold tracking-wide text-[#8a92a8] uppercase">
        PS Plus · главная подписка Sony
      </p>
      <div className="flex flex-col gap-2">
        {plusOffers.map((offer) => (
          <button
            key={offer.id}
            type="button"
            onClick={() => onOffer(offer)}
            className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left"
          >
            <span
              className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl text-[8px] font-bold tracking-wide ${tones[offer.tone]}`}
            >
              <span>{offer.badge}</span>
              <PlatformIcon icon="playstation" className="mt-0.5 h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-start justify-between gap-2">
                <span className="text-[15px] font-semibold">{offer.title}</span>
                <span className="shrink-0 text-[15px] font-semibold">
                  {offer.priceRub.toLocaleString("ru-RU")} ₽
                </span>
              </span>
              <ul className="mt-1 space-y-0.5 text-[11px] text-[#8a92a8]">
                {(psPlusFeatures[offer.badge] ?? []).slice(0, 3).map((line) => (
                  <li key={line}>✓ {line}</li>
                ))}
              </ul>
            </span>
          </button>
        ))}
      </div>

      {eaOffer ? (
        <>
          <p className="text-[12px] font-semibold tracking-wide text-[#8a92a8] uppercase">
            EA Play · игры Electronic Arts
          </p>
          <button
            type="button"
            onClick={() => onOffer(eaOffer)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left"
          >
            <span className="flex items-start justify-between gap-2">
              <span>
                <span className="block text-[15px] font-semibold">EA Play</span>
                <span className="mt-1 block text-[12px] text-[#8a92a8]">
                  Каталог EA, пробный доступ и скидка 10%
                </span>
              </span>
              <span className="shrink-0 text-[15px] font-semibold">
                {eaOffer.priceRub.toLocaleString("ru-RU")} ₽
              </span>
            </span>
            <ul className="mt-2 space-y-0.5 text-[11px] text-[#8a92a8]">
              {eaPlayFeatures.slice(0, 3).map((line) => (
                <li key={line}>✓ {line}</li>
              ))}
            </ul>
          </button>
        </>
      ) : null}
    </div>
  );
}
