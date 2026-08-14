"use client";

import { useState } from "react";
import { AiShop } from "@/components/AiShop";
import { AppStoreShop } from "@/components/AppStoreShop";
import { BottomNav, type StoreTab } from "@/components/BottomNav";
import { Cabinet } from "@/components/Cabinet";
import { CatalogHome } from "@/components/CatalogHome";
import { CheckoutPanel } from "@/components/CheckoutPanel";
import { GameCard } from "@/components/GameCard";
import { HomeMenu } from "@/components/HomeMenu";
import { NavHeartIcon } from "@/components/icons";
import { OrderWizard } from "@/components/OrderWizard";
import { PsnShop } from "@/components/PsnShop";
import { RobloxShop } from "@/components/RobloxShop";
import { SteamShop } from "@/components/SteamShop";
import { XboxShop } from "@/components/XboxShop";
import type { CheckoutItem } from "@/data/cart";
import { getGameById, type Game } from "@/data/games";
import { homeRegions, type ShopEntry } from "@/data/home";
import { psDurations, type PsOffer } from "@/data/ps-subscriptions";
import { formatRub, priceForRegion } from "@/lib/pricing";

type CartLine = {
  id: string;
  title: string;
  priceRub: number;
  cover?: string;
};

type Screen =
  | { name: "landing" }
  | { name: "store" }
  | { name: "service"; entry: ShopEntry }
  | { name: "game"; gameId: string }
  | { name: "checkout"; item: CheckoutItem };

export function ShopApp() {
  const [screen, setScreen] = useState<Screen>({ name: "landing" });
  const [regionId, setRegionId] = useState("tr");
  const [tab, setTab] = useState<StoreTab>("home");
  const [months, setMonths] = useState(12);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [query, setQuery] = useState("");

  const regionTitle =
    homeRegions.find((item) => item.regionId === regionId)?.title ?? "PlayStation";

  function toggleFav(id: string) {
    setFavoriteIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function addToCart(line: CartLine) {
    setCart((current) => [...current, line]);
    setTab("cart");
    setScreen({ name: "store" });
  }

  function openGame(game: Game) {
    setScreen({ name: "game", gameId: game.id });
  }

  function checkoutOffer(offer: PsOffer, priceRub: number) {
    const duration =
      offer.id === "gta-plus"
        ? "1 месяц"
        : (psDurations.find((item) => item.months === months)?.title ?? `${months} мес.`);
    setScreen({
      name: "checkout",
      item: {
        title: `${offer.title}, ${duration}`,
        priceRub,
        platformTitle: `PlayStation · ${regionTitle}`,
        regionTitle,
      },
    });
  }

  function checkoutGame(game: Game) {
    setScreen({
      name: "checkout",
      item: {
        title: game.title,
        priceRub: priceForRegion(game.priceRub, regionId),
        platformTitle: `PlayStation · ${regionTitle}`,
        regionTitle,
      },
    });
  }

  function checkoutCart() {
    if (cart.length === 0) {
      return;
    }
    setScreen({
      name: "checkout",
      item: {
        title: cart.map((item) => item.title).join(", "),
        priceRub: cart.reduce((sum, item) => sum + item.priceRub, 0),
        platformTitle: `PlayStation · ${regionTitle}`,
        regionTitle,
      },
    });
  }

  if (screen.name === "landing") {
    return (
      <HomeMenu
        onCabinet={() => {
          setTab("profile");
          setScreen({ name: "store" });
        }}
        onOpenRegion={(id) => {
          setRegionId(id);
          setTab("home");
          setScreen({ name: "store" });
        }}
        onOpenService={(entry) => setScreen({ name: "service", entry })}
      />
    );
  }

  if (screen.name === "service") {
    const goStore = (next: StoreTab) => {
      setTab(next);
      setScreen({ name: "store" });
    };

    if (screen.entry.platformId === "xbox") {
      return (
        <XboxShop
          onHome={() => setScreen({ name: "landing" })}
          onFavorites={() => goStore("favorites")}
          onCart={() => goStore("cart")}
          onProfile={() => goStore("profile")}
        />
      );
    }

    if (screen.entry.platformId === "steam") {
      return (
        <SteamShop
          onHome={() => setScreen({ name: "landing" })}
          onFavorites={() => goStore("favorites")}
          onCart={() => goStore("cart")}
          onProfile={() => goStore("profile")}
        />
      );
    }

    if (screen.entry.platformId === "apple") {
      return (
        <AppStoreShop
          onHome={() => setScreen({ name: "landing" })}
          onFavorites={() => goStore("favorites")}
          onCart={() => goStore("cart")}
          onProfile={() => goStore("profile")}
        />
      );
    }

    if (screen.entry.platformId === "roblox") {
      return (
        <RobloxShop
          onHome={() => setScreen({ name: "landing" })}
          onFavorites={() => goStore("favorites")}
          onCart={() => goStore("cart")}
          onProfile={() => goStore("profile")}
        />
      );
    }

    if (screen.entry.platformId === "ai") {
      return (
        <AiShop
          onHome={() => setScreen({ name: "landing" })}
          onFavorites={() => goStore("favorites")}
          onCart={() => goStore("cart")}
          onProfile={() => goStore("profile")}
        />
      );
    }

    if (screen.entry.platformId === "playstation" && screen.entry.kind === "cards") {
      return (
        <PsnShop
          onHome={() => setScreen({ name: "landing" })}
          onFavorites={() => goStore("favorites")}
          onCart={() => goStore("cart")}
          onProfile={() => goStore("profile")}
          onSubscriptions={() => {
            setTab("home");
            setScreen({ name: "store" });
          }}
        />
      );
    }

    return (
      <div className="px-[22px] py-4">
        <OrderWizard
          key={`${screen.entry.platformId}-${screen.entry.kind}`}
          entry={screen.entry}
          onBack={() => setScreen({ name: "landing" })}
        />
      </div>
    );
  }

  if (screen.name === "checkout") {
    return (
      <CheckoutPanel
        platformTitle={screen.item.platformTitle}
        regionTitle={screen.item.regionTitle}
        label={screen.item.title}
        priceRub={screen.item.priceRub}
        onBack={() => setScreen({ name: "store" })}
        onHome={() => {
          setTab("home");
          setScreen({ name: "store" });
        }}
      />
    );
  }

  const storeShell = (children: React.ReactNode) => (
    <div className="relative min-h-dvh bg-[#08090c]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#142042_0%,#08090c_55%)]" />
      <div className="relative z-10">{children}</div>
      <BottomNav
        regionId={regionId}
        tab={tab}
        cartCount={cart.length}
        onTab={(next) => {
          setTab(next);
          setScreen({ name: "store" });
        }}
        onRegion={() => setScreen({ name: "landing" })}
      />
    </div>
  );

  if (screen.name === "game") {
    const game = getGameById(screen.gameId);
    if (!game) {
      return storeShell(
        <div className="px-[22px] pt-4 text-sm text-[#8a92a8]">
          Игра не найдена
        </div>
      );
    }
    return storeShell(
      <GamePage
        game={game}
        priceRub={priceForRegion(game.priceRub, regionId)}
        favored={favoriteIds.includes(game.id)}
        onBack={() => setScreen({ name: "store" })}
        onFav={() => toggleFav(game.id)}
        onBuy={() => checkoutGame(game)}
        onCart={() =>
          addToCart({
            id: `${game.id}-${Date.now()}`,
            title: game.title,
            priceRub: priceForRegion(game.priceRub, regionId),
            cover: game.cover,
          })
        }
      />
    );
  }

  if (tab === "favorites") {
    const favored = favoriteIds
      .map((id) => getGameById(id))
      .filter((item): item is Game => Boolean(item));
    return storeShell(
      <div className="px-[22px] pt-4 pb-24">
        <h1 className="text-lg font-semibold">Избранное</h1>
        {favored.length === 0 ? (
          <p className="mt-4 text-sm text-[#8a92a8]">Пока пусто — добавьте игры сердцем</p>
        ) : (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {favored.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  priceRub={priceForRegion(game.priceRub, regionId)}
                  favored
                  onOpen={() => openGame(game)}
                  onFav={() => toggleFav(game.id)}
                />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (tab === "cart") {
    const total = cart.reduce((sum, item) => sum + item.priceRub, 0);
    return storeShell(
      <div className="px-[22px] pt-4 pb-24">
        <h1 className="text-lg font-semibold">Корзина</h1>
        {cart.length === 0 ? (
          <p className="mt-4 text-sm text-[#8a92a8]">Корзина пуста</p>
        ) : (
          <>
            <div className="mt-4 flex flex-col gap-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3"
                >
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="shrink-0 text-sm font-semibold">
                    {item.priceRub.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-end justify-between">
              <p className="text-sm text-[#8a92a8]">К оплате</p>
              <p className="text-2xl font-semibold">
                {total.toLocaleString("ru-RU")} ₽
              </p>
            </div>
            <button
              type="button"
              onClick={checkoutCart}
              className="mt-4 h-12 w-full rounded-2xl bg-gradient-to-r from-[#d4af6a] to-[#e8c47e] text-base font-semibold text-[#0a0c12]"
            >
              Оформить
            </button>
          </>
        )}
      </div>
    );
  }

  if (tab === "profile") {
    return storeShell(
      <div className="px-[22px] pt-4 pb-24">
        <Cabinet
          regionId={regionId}
          onFavorites={() => setTab("favorites")}
        />
      </div>
    );
  }

  return storeShell(
    <CatalogHome
      regionId={regionId}
      favoriteIds={favoriteIds}
      months={months}
      query={query}
      onQuery={setQuery}
      onCabinet={() => setTab("profile")}
      onDuration={setMonths}
      onOffer={checkoutOffer}
      onGame={openGame}
      onFav={toggleFav}
    />
  );
}

function GamePage({
  game,
  priceRub,
  favored,
  onBack,
  onFav,
  onBuy,
  onCart,
}: {
  game: Game;
  priceRub: number;
  favored: boolean;
  onBack: () => void;
  onFav: () => void;
  onBuy: () => void;
  onCart: () => void;
}) {
  return (
    <div className="px-[22px] pt-3 pb-24">
      <button type="button" onClick={onBack} className="text-sm text-[#8a92a8]">
        ← Назад
      </button>
      <div
        className="mt-3 h-72 rounded-2xl bg-[#12141c] bg-cover bg-center"
        style={game.cover ? { backgroundImage: `url(${game.cover})` } : undefined}
      />
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{game.title}</h1>
          <p className="mt-1 text-sm text-[#8a92a8]">
            {game.platform} · {game.edition}
          </p>
        </div>
        <button type="button" onClick={onFav} aria-label="В избранное">
          <NavHeartIcon
            className={`h-6 w-6 ${favored ? "fill-[#ff5a5a] text-[#ff5a5a]" : "text-white"}`}
          />
        </button>
      </div>
      <p className="mt-4 text-2xl font-semibold">{formatRub(priceRub)}</p>
      <button
        type="button"
        onClick={onBuy}
        className="mt-5 h-12 w-full rounded-2xl bg-gradient-to-r from-[#d4af6a] to-[#e8c47e] text-base font-semibold text-[#0a0c12]"
      >
        Купить
      </button>
      <button
        type="button"
        onClick={onCart}
        className="mt-2 h-12 w-full rounded-2xl border border-white/15 text-base font-medium"
      >
        В корзину
      </button>
    </div>
  );
}
