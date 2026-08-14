"use client";

import {
  NavCartIcon,
  NavGlobeIcon,
  NavHeartIcon,
  NavHomeIcon,
  NavProfileIcon,
  NavSearchIcon,
} from "@/components/icons";
import { homeRegions } from "@/data/home";

export type StoreTab = "home" | "search" | "favorites" | "cart" | "profile";

type Props = {
  regionId: string;
  tab: StoreTab;
  cartCount: number;
  onTab: (tab: StoreTab) => void;
  onRegion: () => void;
};

export function BottomNav({
  regionId,
  tab,
  cartCount,
  onTab,
  onRegion,
}: Props) {
  const region = homeRegions.find((item) => item.regionId === regionId);
  const active = "text-[#d4af6a]";
  const idle = "text-[#8a92a8]";

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-30 mx-auto flex w-full max-w-[420px] items-end justify-around border-t border-white/10 bg-[#08090c]/95 px-2 pt-2 pb-[max(10px,env(safe-area-inset-bottom))] backdrop-blur-xl">
      <button type="button" onClick={onRegion} className={`flex flex-col items-center gap-1 ${idle}`}>
        <span className="relative">
          <NavGlobeIcon className="h-5 w-5" />
          <span className="absolute -right-1 -bottom-0.5 text-[10px] leading-none">
            {region?.flagIcon ?? "🌐"}
          </span>
        </span>
      </button>
      <TabButton
        label="Главная"
        active={tab === "home"}
        onClick={() => onTab("home")}
      >
        <NavHomeIcon className={`h-5 w-5 ${tab === "home" ? active : idle}`} />
      </TabButton>
      <TabButton
        label="Поиск"
        active={tab === "search"}
        onClick={() => onTab("search")}
      >
        <NavSearchIcon className={`h-5 w-5 ${tab === "search" ? active : idle}`} />
      </TabButton>
      <TabButton
        label="Избранное"
        active={tab === "favorites"}
        onClick={() => onTab("favorites")}
      >
        <NavHeartIcon className={`h-5 w-5 ${tab === "favorites" ? active : idle}`} />
      </TabButton>
      <TabButton
        label="Корзина"
        active={tab === "cart"}
        onClick={() => onTab("cart")}
      >
        <span className="relative">
          <NavCartIcon className={`h-5 w-5 ${tab === "cart" ? active : idle}`} />
          {cartCount > 0 ? (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#ff5a5a]" />
          ) : null}
        </span>
      </TabButton>
      <TabButton
        label="Профиль"
        active={tab === "profile"}
        onClick={() => onTab("profile")}
      >
        <NavProfileIcon className={`h-5 w-5 ${tab === "profile" ? active : idle}`} />
      </TabButton>
    </nav>
  );
}

function TabButton({
  label,
  children,
  onClick,
}: {
  label: string;
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex flex-col items-center px-1 py-1"
    >
      {children}
    </button>
  );
}
