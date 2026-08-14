"use client";

import { ChevronIcon, PlatformIcon } from "@/components/icons";
import {
  homeChannels,
  homeRegions,
  homeServices,
  type HomeRegion,
  type HomeService,
  type ShopEntry,
} from "@/data/home";

type Props = {
  onOpenService: (entry: ShopEntry) => void;
  onOpenRegion: (regionId: string) => void;
  onCabinet: () => void;
};

export function HomeMenu({ onOpenService, onOpenRegion, onCabinet }: Props) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#08090c] px-[22px] pb-10 pt-2">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#142042_0%,#08090c_60%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between rounded-[12px] border border-white/5 border-t-white/15 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
          <p className="flex items-baseline gap-2">
            <span className="text-[11px] font-semibold tracking-[0.18em] text-[#8a92a8] uppercase">
              Бонусы
            </span>
            <span className="text-lg font-medium tracking-tight text-[#d4af6a]">
              50 ₽
            </span>
          </p>
          <button
            type="button"
            onClick={onCabinet}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-[#d4af6a]"
          >
            Кабинет
            <span aria-hidden>→</span>
          </button>
        </div>

        <p className="mt-[18px] mb-[15px] text-[11px] font-semibold tracking-[0.2em] text-[#8a92a8] uppercase">
          Выберите <span className="text-[#d4af6a]">регион</span> аккаунта
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          {homeRegions.map((item) => (
            <RegionCard
              key={item.id}
              item={item}
              onSelect={() => onOpenRegion(item.regionId)}
            />
          ))}
        </div>

        <p className="mt-7 mb-3 text-[11px] font-semibold tracking-[0.14em] text-[#8a92a8] uppercase">
          Другие сервисы
        </p>
        <div className="flex flex-col gap-2.5">
          {homeServices.map((item) => (
            <ServiceRow
              key={item.id}
              item={item}
              onSelect={() => onOpenService(item.entry)}
            />
          ))}
        </div>

        <p className="mt-8 mb-3 text-[11px] font-semibold tracking-[0.14em] text-[#8a92a8] uppercase">
          Наши каналы
        </p>
        <div className="grid grid-cols-3 gap-2">
          {homeChannels.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-2 px-1 py-3 text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] text-white">
                <PlatformIcon icon={item.icon} className="h-6 w-6" />
              </span>
              <span className="text-[12px] font-semibold">{item.title}</span>
              <span className="text-[10px] leading-3 text-[#8a92a8]">
                {item.subtitle}
              </span>
            </a>
          ))}
        </div>
      </div>
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
      className="relative flex min-h-[210px] flex-col items-start rounded-[14px] border border-white/10 border-t-white/20 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-4 text-left shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      <span className="text-[28px] leading-none">{item.flagIcon}</span>
      <span className="absolute top-3.5 right-3.5 rounded-[5px] border border-[#d4af6a]/20 bg-[#d4af6a]/10 px-1.5 py-0.5 text-[7px] font-semibold tracking-[0.08em] text-[#d4af6a] uppercase">
        {item.badge}
      </span>
      <span className="mt-auto text-[22px] font-bold tracking-tight">
        {item.title}
      </span>
      <span className="mt-1.5 text-[12px] leading-4 text-[#8a92a8]">
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
  const iconWrap: Record<string, string> = {
    xbox: "bg-[#107c10] text-white",
    steam: "bg-[#1b2838] text-white",
    playstation: "bg-[#00439c] text-white",
    roblox: "bg-[#e2231a] text-white",
    apple: "bg-gradient-to-br from-[#2ac9fa] to-[#0a7cff] text-white",
    ai: "bg-white text-black",
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className="relative flex items-center gap-3 rounded-[14px] border border-white/10 bg-white/[0.04] px-3 py-3 text-left"
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[10px] ${iconWrap[item.icon] ?? "bg-[#2a2a2e]"}`}
      >
        <PlatformIcon icon={item.icon} className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1 pr-8">
        <span className="block text-[15px] font-semibold">{item.title}</span>
        <span className="mt-0.5 block text-[12px] text-[#8a92a8]">
          {item.subtitle}
        </span>
      </span>
      {item.badge ? (
        <span
          className={`absolute top-2.5 right-8 rounded-[5px] px-1.5 py-0.5 text-[9px] font-bold tracking-wide ${
            item.badge.tone === "green"
              ? "bg-[#107C10] text-white"
              : "bg-[#4a7cff] text-white"
          }`}
        >
          {item.badge.label}
        </span>
      ) : null}
      <ChevronIcon className="h-3.5 w-3.5 shrink-0 text-white/35" />
    </button>
  );
}
