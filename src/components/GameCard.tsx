"use client";

import type { Game } from "@/data/games";
import { NavHeartIcon } from "@/components/icons";

export function GameCard({
  game,
  favored,
  onOpen,
  onFav,
}: {
  game: Game;
  favored: boolean;
  onOpen: () => void;
  onFav: () => void;
}) {
  return (
    <div className="relative w-[148px] shrink-0">
      <button type="button" onClick={onOpen} className="w-full text-left">
        <div
          className="relative h-[198px] overflow-hidden rounded-xl bg-[#12141c] bg-cover bg-center"
          style={{ backgroundImage: `url(${game.cover})` }}
        >
          <span className="absolute top-2 left-2 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold">
            {game.platform}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 min-h-10 text-[13px] font-semibold leading-5">
          {game.title}
        </p>
        <p className="mt-0.5 text-[11px] text-[#8a92a8]">{game.edition}</p>
        <p className="mt-1 flex items-baseline gap-1.5">
          {game.discount ? (
            <span className="text-[11px] font-semibold text-[#ff5a5a]">
              −{game.discount}%
            </span>
          ) : null}
          <span className="text-[15px] font-semibold">
            {game.priceRub.toLocaleString("ru-RU")} ₽
          </span>
        </p>
      </button>
      <button
        type="button"
        onClick={onFav}
        className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5"
        aria-label="В избранное"
      >
        <NavHeartIcon
          className={`h-4 w-4 ${favored ? "fill-[#ff5a5a] text-[#ff5a5a]" : "text-white"}`}
        />
      </button>
    </div>
  );
}
