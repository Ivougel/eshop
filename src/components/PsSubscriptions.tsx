import { PlatformIcon } from "@/components/icons";
import { getPsOffers, psCatalogs, psDurations, type PsOffer } from "@/data/ps-subscriptions";

const tabActive = "bg-gradient-to-r from-[#ff4d6d] to-[#ff9a3c] text-white";
const tabIdle = "bg-[#1c1c1f] text-white/80";

const tones: Record<PsOffer["tone"], string> = {
  gold: "bg-[#f3d27a] text-[#3b2a00]",
  orange: "bg-[#ff9a3c] text-[#3b1600]",
  dark: "bg-[#111113] text-[#f3d27a] ring-1 ring-[#f3d27a]/40",
  blue: "bg-[#1d4ed8] text-white",
};

type Props = {
  catalogId: string;
  months: number;
  offerId: string | null;
  onCatalog: (id: string) => void;
  onDuration: (months: number) => void;
  onOffer: (id: string) => void;
};

export function PsSubscriptions({
  catalogId,
  months,
  offerId,
  onCatalog,
  onDuration,
  onOffer,
}: Props) {
  const offers = getPsOffers(catalogId, months);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold">Подписки</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {psCatalogs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onCatalog(item.id)}
              className={`h-14 rounded-2xl text-base font-semibold ${
                item.id === catalogId ? tabActive : tabIdle
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {psDurations.map((item) => (
          <button
            key={item.months}
            type="button"
            onClick={() => onDuration(item.months)}
            className={`shrink-0 rounded-2xl px-4 py-2.5 text-sm font-medium ${
              item.months === months ? tabActive : tabIdle
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {offers.map((offer) => (
          <button
            key={offer.id}
            type="button"
            onClick={() => onOffer(offer.id)}
            className={`flex items-center gap-3 rounded-2xl bg-[#1c1c1f] p-3 text-left ${
              offer.id === offerId ? "ring-2 ring-[#ff9a3c]" : ""
            }`}
          >
            <span
              className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl text-[8px] font-bold tracking-wide ${tones[offer.tone]}`}
            >
              <span>{offer.badge}</span>
              <PlatformIcon icon="playstation" className="mt-0.5 h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-medium">{offer.title}</span>
            </span>
            <span className="text-base font-semibold">
              {offer.priceRub.toLocaleString("ru-RU")} ₽
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
