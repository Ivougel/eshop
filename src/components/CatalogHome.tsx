"use client";

import { useEffect, useState } from "react";
import { GameCard } from "@/components/GameCard";
import { NavSearchIcon } from "@/components/icons";
import { PsSubscriptions } from "@/components/PsSubscriptions";
import {
  catalogSections,
  getGames,
  searchGames,
  type Game,
} from "@/data/games";
import type { PsOffer } from "@/data/ps-subscriptions";
import { formatRub, priceForRegion } from "@/lib/pricing";

type Props = {
  regionId: string;
  favoriteIds: string[];
  months: number;
  query: string;
  onQuery: (value: string) => void;
  onCabinet: () => void;
  onDuration: (months: number) => void;
  onOffer: (offer: PsOffer, priceRub: number) => void;
  onGame: (game: Game) => void;
  onFav: (gameId: string) => void;
};

export function CatalogHome({
  regionId,
  favoriteIds,
  months,
  query,
  onQuery,
  onCabinet,
  onDuration,
  onOffer,
  onGame,
  onFav,
}: Props) {
  const found = query.trim() ? searchGames(query) : [];

  return (
    <div className="flex flex-col gap-7 px-5 pt-3 pb-28">
      <header className="flex items-center gap-2">
        <label className="relative min-w-0 flex-1">
          <NavSearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8a92a8]" />
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Найти игру или подписку"
            className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.05] pr-3 pl-10 text-sm outline-none placeholder:text-[#8a92a8] focus:border-[#d4af6a]"
          />
        </label>
        <button
          type="button"
          onClick={onCabinet}
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-[#d4af6a]/40 px-3 text-sm font-semibold text-[#d4af6a]"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d4af6a] text-[10px] font-bold text-[#0a0c12]">
            ₽
          </span>
          50 ₽
        </button>
      </header>

      {query.trim() ? (
        <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {found.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              priceRub={priceForRegion(game.priceRub, regionId)}
              favored={favoriteIds.includes(game.id)}
              onOpen={() => onGame(game)}
              onFav={() => onFav(game.id)}
            />
          ))}
        </div>
      ) : (
        <>
          <PromoBanner />
          <Carousel title="Лидеры продаж">
            {getGames("hits").map((game) => (
              <GameCard
                key={game.id}
                game={game}
                priceRub={priceForRegion(game.priceRub, regionId)}
                favored={favoriteIds.includes(game.id)}
                onOpen={() => onGame(game)}
                onFav={() => onFav(game.id)}
              />
            ))}
          </Carousel>
          <PsSubscriptions
            regionId={regionId}
            months={months}
            onDuration={onDuration}
            onOffer={onOffer}
          />
          {catalogSections
            .filter((section) => section.id !== "hits")
            .map((section) => (
              <Carousel key={section.id} title={section.title}>
                {getGames(section.id).map((game) =>
                  game.kind === "donate" ? (
                    <DonateCard
                      key={game.id}
                      game={game}
                      priceRub={priceForRegion(game.priceRub, regionId)}
                      onOpen={() => onGame(game)}
                    />
                  ) : (
                    <GameCard
                      key={game.id}
                      game={game}
                      priceRub={priceForRegion(game.priceRub, regionId)}
                      favored={favoriteIds.includes(game.id)}
                      onOpen={() => onGame(game)}
                      onFav={() => onFav(game.id)}
                    />
                  )
                )}
              </Carousel>
            ))}
        </>
      )}
    </div>
  );
}

function Carousel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold">{title}</h2>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-sm text-white/70">
          ›
        </span>
      </div>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </section>
  );
}

function DonateCard({
  game,
  priceRub,
  onOpen,
}: {
  game: Game;
  priceRub: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-[152px] shrink-0 text-left"
    >
      <span
        className={`flex h-[120px] items-center justify-center rounded-[16px] text-[15px] font-bold ${
          game.id === "fc26-points" ? "bg-[#107c10]" : "bg-[#e8d5b5] text-[#3b2a00]"
        }`}
      >
        {game.title}
      </span>
      <span className="mt-2 block text-[13px] font-semibold">{game.title}</span>
      <span className="mt-1 block text-[15px] font-semibold">{formatRub(priceRub)}</span>
    </button>
  );
}

function PromoBanner() {
  const [left, setLeft] = useState({ d: 12, h: 0, m: 22, s: 27 });

  useEffect(() => {
    const end = Date.UTC(2026, 7, 27, 18, 0, 0);
    function tick() {
      const diff = Math.max(0, end - Date.now());
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60,
      });
    }
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const cells = [
    [left.d, "дн"],
    [left.h, "ч"],
    [left.m, "м"],
    [left.s, "с"],
  ] as const;

  return (
    <div className="overflow-hidden rounded-[20px] bg-[radial-gradient(circle_at_top_right,#3b4ea0,transparent_45%),linear-gradient(160deg,#10182c,#0b1020)] p-5">
      <p className="text-[20px] leading-6 font-bold tracking-wide uppercase">
        На старт, приготовиться, играть!
      </p>
      <p className="mt-2 text-[13px] font-semibold text-[#d4af6a]">
        Экономьте до 75%
      </p>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {cells.map(([value, label]) => (
          <span
            key={label}
            className="rounded-xl bg-[#152238] py-2 text-center"
          >
            <span className="block text-[16px] font-semibold">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-[#8a92a8]">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
