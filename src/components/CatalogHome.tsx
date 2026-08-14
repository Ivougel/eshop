"use client";

import { GameCard } from "@/components/GameCard";
import { PsSubscriptions } from "@/components/PsSubscriptions";
import { getGames, type Game } from "@/data/games";
import type { PsOffer } from "@/data/ps-subscriptions";

type Props = {
  favoriteIds: string[];
  months: number;
  onDuration: (months: number) => void;
  onOffer: (offer: PsOffer) => void;
  onGame: (game: Game) => void;
  onFav: (gameId: string) => void;
};

export function CatalogHome({
  favoriteIds,
  months,
  onDuration,
  onOffer,
  onGame,
  onFav,
}: Props) {
  const hits = getGames("hits");
  const news = getGames("new");

  return (
    <div className="flex flex-col gap-7 px-[22px] pt-3 pb-24">
      <PsSubscriptions
        months={months}
        onDuration={onDuration}
        onOffer={onOffer}
      />

      <Carousel title="Лидеры продаж">
        {hits.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            favored={favoriteIds.includes(game.id)}
            onOpen={() => onGame(game)}
            onFav={() => onFav(game.id)}
          />
        ))}
      </Carousel>

      <Carousel title="Новинки">
        {news.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            favored={favoriteIds.includes(game.id)}
            onOpen={() => onGame(game)}
            onFav={() => onFav(game.id)}
          />
        ))}
      </Carousel>
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
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </section>
  );
}
