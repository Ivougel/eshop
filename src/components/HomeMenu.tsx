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
    <div className="relative min-h-dvh overflow-hidden bg-[#08090c] px-5 pb-12 pt-3">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1a2744_0%,#08090c_52%)]" />
      <div className="relative z-10 flex flex-col gap-6">
        <header className="flex h-12 items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 backdrop-blur-xl">
          <p className="flex items-baseline gap-2">
            <span className="text-[10px] font-semibold tracking-[0.22em] text-[#8a92a8] uppercase">
              Бонусы
            </span>
            <span className="text-[17px] font-semibold tracking-tight text-[#d4af6a]">
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
        </header>

        <section>
          <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-[#8a92a8] uppercase">
            Выберите <span className="text-[#d4af6a]">регион</span> аккаунта
          </p>
          <div className="grid grid-cols-2 gap-3">
            {homeRegions.map((item) => (
              <RegionCard
                key={item.id}
                item={item}
                onSelect={() => onOpenRegion(item.regionId)}
              />
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-[#8a92a8] uppercase">
            Другие сервисы
          </p>
          <div className="flex flex-col gap-2">
            {homeServices.map((item) => (
              <ServiceRow
                key={item.id}
                item={item}
                onSelect={() => onOpenService(item.entry)}
              />
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-[#8a92a8] uppercase">
            Наши каналы
          </p>
          <div className="grid grid-cols-3 gap-2">
            {homeChannels.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-2 py-3.5 text-center"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.06] text-white">
                  <PlatformIcon icon={item.icon} className="h-5 w-5" />
                </span>
                <span className="text-[12px] font-semibold">{item.title}</span>
                <span className="text-[10px] leading-3 text-[#8a92a8]">
                  {item.subtitle}
                </span>
              </a>
            ))}
          </div>
        </section>
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
      className="relative flex min-h-[228px] flex-col items-start overflow-hidden rounded-[20px] border border-white/[0.09] bg-white/[0.035] p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
    >
      <span
        className="text-[56px] leading-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
        aria-hidden
      >
        {item.flagIcon}
      </span>
      <span className="absolute top-3.5 right-3 rounded-md border border-[#d4af6a]/25 bg-[#d4af6a]/12 px-1.5 py-0.5 text-[8px] font-semibold tracking-[0.1em] text-[#d4af6a] uppercase">
        {item.badge}
      </span>
      <span className="mt-auto text-[22px] leading-none font-bold tracking-tight">
        {item.title}
      </span>
      <span className="mt-2 line-clamp-3 text-[12px] leading-[1.35] text-[#8a92a8]">
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
      className="flex items-center gap-3.5 rounded-[18px] border border-white/[0.08] bg-white/[0.035] px-3.5 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[13px] ${iconWrap[item.icon] ?? "bg-[#2a2a2e]"}`}
      >
        <PlatformIcon icon={item.icon} className="h-7 w-7" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[15px] font-semibold">{item.title}</span>
          {item.badge ? (
            <span
              className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold tracking-wide ${
                item.badge.tone === "green"
                  ? "bg-[#107C10] text-white"
                  : "bg-[#4a7cff] text-white"
              }`}
            >
              {item.badge.label}
            </span>
          ) : null}
        </span>
        <span className="mt-0.5 block truncate text-[12px] text-[#8a92a8]">
          {item.subtitle}
        </span>
      </span>
      <ChevronIcon className="h-4 w-4 shrink-0 text-white/30" />
    </button>
  );
}
