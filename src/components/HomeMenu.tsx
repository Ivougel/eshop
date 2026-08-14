"use client";

import { ChevronIcon, PlatformIcon } from "@/components/icons";
import {
  homeChannels,
  homeRegions,
  homeServices,
  shopEntryForRegion,
  type HomeRegion,
  type HomeService,
  type ShopEntry,
} from "@/data/home";

const GOLD = "#c9b07a";

const iconWrap: Record<string, string> = {
  xbox: "bg-[#107c10] text-white",
  steam: "bg-[#1b2838] text-white",
  playstation: "bg-[#00439c] text-white",
  roblox: "bg-[#e2231a] text-white",
  apple: "bg-[#0a84ff] text-white",
  ai: "bg-[#10a37f] text-white",
  telegram: "bg-[#229ed9] text-white",
};

type Props = {
  onOpen: (entry: ShopEntry) => void;
  onCabinet: () => void;
};

export function HomeMenu({ onOpen, onCabinet }: Props) {
  return (
    <div className="flex flex-col gap-7 pb-6">
      <header className="flex items-center justify-between">
        <p className="text-[13px] font-medium tracking-wide text-white/55">
          БОНУСЫ{" "}
          <span className="font-semibold" style={{ color: GOLD }}>
            50 ₽
          </span>
        </p>
        <button
          type="button"
          onClick={onCabinet}
          className="text-[13px] font-medium"
          style={{ color: GOLD }}
        >
          Кабинет →
        </button>
      </header>

      <section>
        <h1 className="text-[17px] font-bold uppercase tracking-wide">
          Выберите <span style={{ color: GOLD }}>регион</span> аккаунта
        </h1>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {homeRegions.map((item) => (
            <RegionCard
              key={item.id}
              item={item}
              onSelect={() => onOpen(shopEntryForRegion(item.regionId))}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/40">
          Другие сервисы
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          {homeServices.map((item) => (
            <ServiceRow
              key={item.id}
              item={item}
              onSelect={() => onOpen(item.entry)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/40">
          Наши каналы
        </h2>
        <div className="mt-3 flex gap-3">
          {homeChannels.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1c1c1e] text-white"
              aria-label={item.title}
            >
              <PlatformIcon icon={item.icon} className="h-7 w-7" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function RegionCard({
  item,
  onSelect,
}: {
  item: HomeRegion;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="relative flex min-h-[196px] flex-col items-start rounded-2xl bg-[#1c1c1e] p-3.5 text-left"
    >
      <span className="text-2xl leading-none">{item.flagIcon}</span>
      <span
        className="absolute top-3 right-3 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-black"
        style={{ backgroundColor: GOLD }}
      >
        {item.badge}
      </span>
      <span className="mt-auto text-[22px] font-bold leading-tight">
        {item.title}
      </span>
      <span className="mt-1.5 text-[12px] leading-4 text-white/50">
        {item.description}
      </span>
    </button>
  );
}

function ServiceRow({
  item,
  onSelect,
}: {
  item: HomeService;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="relative flex items-center gap-3 rounded-2xl bg-[#1c1c1e] px-3 py-3 text-left"
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconWrap[item.icon] ?? "bg-[#2a2a2e]"}`}
      >
        <PlatformIcon icon={item.icon} className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1 pr-10">
        <span className="block text-[15px] font-semibold">{item.title}</span>
        <span className="mt-0.5 block text-[12px] text-white/45">
          {item.subtitle}
        </span>
      </span>
      {item.badge ? (
        <span
          className={`absolute top-2.5 right-9 rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-wide ${
            item.badge.tone === "green"
              ? "bg-[#22c55e] text-black"
              : "bg-[#3b82f6] text-white"
          }`}
        >
          {item.badge.label}
        </span>
      ) : null}
      <ChevronIcon className="h-4 w-4 shrink-0 text-white/35" />
    </button>
  );
}
