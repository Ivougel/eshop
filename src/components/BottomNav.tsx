"use client";

import {
  NavCartIcon,
  NavHeartIcon,
  NavHomeIcon,
  NavProfileIcon,
} from "@/components/icons";
import { homeRegions } from "@/data/home";

export type StoreTab = "home" | "favorites" | "cart" | "profile";

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
    <nav className="fixed right-3 bottom-[max(10px,env(safe-area-inset-bottom))] left-3 z-30 mx-auto flex w-auto max-w-[420px] items-end justify-around rounded-[22px] border border-white/10 bg-[#12141c]/92 px-1 pt-2 pb-2 backdrop-blur-xl">
      <TabButton
        label="Главная"
        active={tab === "home"}
        onClick={() => onTab("home")}
      >
        <NavHomeIcon className={`h-5 w-5 ${tab === "home" ? active : idle}`} />
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
      <button type="button" onClick={onRegion} className="flex flex-col items-center gap-0.5 px-1 py-1">
        <span className="flex h-7 items-center gap-1 rounded-full border border-white/20 px-2 text-[11px] font-semibold leading-none text-white">
          <span className="text-[13px] leading-none">{region?.flagIcon ?? "🌐"}</span>
          <span>{(region?.regionId ?? "tr").toUpperCase()}</span>
        </span>
        <span className="text-[10px] text-[#8a92a8]">Регион</span>
      </button>
    </nav>
  );
}

function TabButton({
  label,
  active,
  onClick,
  children,
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
      className="flex flex-col items-center gap-0.5 px-1 py-1"
    >
      {children}
      <span className={`text-[10px] ${active ? "text-[#d4af6a]" : "text-[#8a92a8]"}`}>
        {label}
      </span>
    </button>
  );
}
