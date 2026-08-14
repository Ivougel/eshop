"use client";

import type { Game } from "@/data/games";
import { NavHeartIcon } from "@/components/icons";
import { formatRub } from "@/lib/pricing";

export function GameCard({
  game,
  priceRub,
  favored,
  onOpen,
  onFav,
}: {
  game: Game;
  priceRub: number;
  favored: boolean;
  onOpen: () => void;
  onFav: () => void;
}) {
  const gold = game.discountTone === "gold";

  return (
    <div className="relative w-[152px] shrink-0">
      <button type="button" onClick={onOpen} className="w-full text-left">
        <div
          className="relative h-[204px] overflow-hidden rounded-[16px] bg-[#12141c] bg-cover bg-center"
          style={game.cover ? { backgroundImage: `url(${game.cover})` } : undefined}
        >
          <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold">
            {game.platform}
          </span>
          {game.preorderDays ? (
            <span className="absolute right-0 bottom-0 left-0 flex text-[10px] font-medium">
              <span className="flex-1 bg-[#1e3a5f] px-2 py-1">До релиза</span>
              <span className="bg-black/80 px-2 py-1">{game.preorderDays} дн.</span>
            </span>
          ) : null}
        </div>
        <p className="mt-2 line-clamp-2 min-h-10 text-[13px] leading-5 font-semibold">
          {game.title}
        </p>
        <p className="mt-0.5 text-[11px] text-[#8a92a8]">{game.edition}</p>
        <p className="mt-1.5 flex items-center gap-1.5">
          {game.discount ? (
            <span
              className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${
                gold ? "bg-[#d4af6a] text-[#0a0c12]" : "bg-[#3b82f6] text-white"
              }`}
            >
              −{game.discount}%
            </span>
          ) : null}
          <span className={`text-[15px] font-semibold ${gold ? "text-[#d4af6a]" : "text-white"}`}>
            {formatRub(priceRub)}
          </span>
        </p>
      </button>
      <button
        type="button"
        onClick={onFav}
        className="absolute top-2 right-2 rounded-full bg-black/45 p-1.5"
        aria-label="В избранное"
      >
        <NavHeartIcon
          className={`h-4 w-4 ${favored ? "fill-[#ff5a5a] text-[#ff5a5a]" : "text-white"}`}
        />
      </button>
    </div>
  );
}
