"use client";

import {
  BitcoinIcon,
  ChevronIcon,
  NavCartIcon,
  NavHeartIcon,
  NavHomeIcon,
  NavProfileIcon,
  PlatformIcon,
  SbpIcon,
} from "@/components/icons";

export type PayMethod = "sbp" | "crypto";
export type ExtraKind = "none" | "promo" | "bonus";

type Brand = "xbox" | "steam" | "apple" | "roblox" | "ai";

type NavProps = {
  active: Brand | "region" | "home" | "favorites" | "cart" | "profile";
  brand?: Brand;
  regionFlag?: string;
  regionCode?: string;
  onHome: () => void;
  onFavorites: () => void;
  onCart: () => void;
  onProfile: () => void;
  onFifth: () => void;
};

export function ServiceNav({
  active,
  brand = "xbox",
  regionFlag,
  regionCode,
  onHome,
  onFavorites,
  onCart,
  onProfile,
  onFifth,
}: NavProps) {
  const idle = "text-[#8a92a8]";
  const gold = "text-[#d4af6a]";

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-30 mx-auto flex w-full max-w-[420px] items-end justify-around border-t border-white/10 bg-[#08090c]/95 px-1 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur-xl">
      <NavItem label="Главная" active={active === "home"} onClick={onHome}>
        <NavHomeIcon className={`h-5 w-5 ${active === "home" ? gold : idle}`} />
      </NavItem>
      <NavItem label="Избранное" active={active === "favorites"} onClick={onFavorites}>
        <NavHeartIcon className={`h-5 w-5 ${active === "favorites" ? gold : idle}`} />
      </NavItem>
      <NavItem label="Корзина" active={active === "cart"} onClick={onCart}>
        <NavCartIcon className={`h-5 w-5 ${active === "cart" ? gold : idle}`} />
      </NavItem>
      <NavItem label="Профиль" active={active === "profile"} onClick={onProfile}>
        <NavProfileIcon className={`h-5 w-5 ${active === "profile" ? gold : idle}`} />
      </NavItem>
      {regionCode ? (
        <button type="button" onClick={onFifth} className="flex flex-col items-center gap-0.5 px-1 py-1">
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold">
            <span>{regionFlag}</span>
            <span>{regionCode}</span>
          </span>
          <span className="text-[10px] text-[#8a92a8]">Регион</span>
        </button>
      ) : (
        <BrandTab brand={brand} onClick={onFifth} />
      )}
    </nav>
  );
}

function BrandTab({ brand, onClick }: { brand: Brand; onClick: () => void }) {
  const labels: Record<Brand, string> = {
    xbox: "Xbox",
    steam: "Steam",
    apple: "App Store",
    roblox: "Roblox",
    ai: "Нейро",
  };
  const wraps: Record<Brand, string> = {
    xbox: "bg-[#107c10] text-white",
    steam: "bg-[#d4af6a]/20 text-[#d4af6a]",
    apple: "bg-white/10 text-white shadow-[0_0_14px_rgba(212,175,106,0.55)]",
    roblox: "bg-[#e2231a]/50 text-white shadow-[0_0_14px_rgba(226,35,26,0.7)]",
    ai: "bg-white/10 text-[#d4af6a] shadow-[0_0_14px_rgba(212,175,106,0.45)]",
  };

  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-0.5 px-1 py-1">
      <span className={`flex h-7 w-7 items-center justify-center rounded-full ${wraps[brand]}`}>
        <PlatformIcon icon={brand === "apple" ? "apple" : brand === "ai" ? "ai" : brand} className="h-4 w-4" />
      </span>
      <span className="text-[10px] font-medium text-[#d4af6a]">{labels[brand]}</span>
    </button>
  );
}

function NavItem({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-0.5 px-1 py-1">
      {children}
      <span className={`text-[10px] ${active ? "text-[#d4af6a]" : "text-[#8a92a8]"}`}>
        {label}
      </span>
    </button>
  );
}

export function PromoRows({
  extra,
  onExtra,
  promo,
  onPromo,
}: {
  extra: ExtraKind;
  onExtra: (value: ExtraKind) => void;
  promo: string;
  onPromo: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-[11px] leading-4 text-[#8a92a8]">
        Промокод и бонусы не суммируются — можно применить что-то одно
      </p>
      <div className="mt-2 overflow-hidden rounded-2xl border border-white/10">
        <button
          type="button"
          onClick={() => onExtra(extra === "promo" ? "none" : "promo")}
          className="flex w-full items-center gap-3 px-3 py-3 text-left"
        >
          <span
            className={`h-4 w-4 rounded-full border ${
              extra === "promo" ? "border-[#3b82f6] bg-[#3b82f6]" : "border-white/30"
            }`}
          />
          <span className="flex-1 text-sm">У меня есть промокод</span>
          <ChevronIcon className="h-4 w-4 text-white/35" />
        </button>
        {extra === "promo" ? (
          <input
            value={promo}
            onChange={(event) => onPromo(event.target.value)}
            placeholder="Промокод"
            className="mx-3 mb-3 h-10 w-[calc(100%-24px)] rounded-xl border border-white/10 bg-[#08090c] px-3 text-sm outline-none focus:border-[#3b82f6]"
          />
        ) : null}
        <div className="h-px bg-white/10" />
        <button
          type="button"
          onClick={() => onExtra(extra === "bonus" ? "none" : "bonus")}
          className="flex w-full items-center gap-3 px-3 py-3 text-left"
        >
          <span
            className={`h-4 w-4 rounded-full border ${
              extra === "bonus" ? "border-[#3b82f6] bg-[#3b82f6]" : "border-white/30"
            }`}
          />
          <span className="flex-1 text-sm">Потратить бонусы</span>
          <ChevronIcon className="h-4 w-4 text-white/35" />
        </button>
      </div>
    </div>
  );
}

export function SummaryCard({
  line,
  linePrice,
  total,
}: {
  line: string;
  linePrice: number | null;
  total: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-start justify-between gap-3 text-sm">
        <span className={linePrice === null ? "text-[#8a92a8]" : "text-white"}>
          {line}
        </span>
        <span className="shrink-0">
          {linePrice === null ? "" : `${linePrice.toLocaleString("ru-RU")} ₽`}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-semibold">Итого</span>
        <span className="text-lg font-semibold text-[#d4af6a]">
          {total.toLocaleString("ru-RU")} ₽
        </span>
      </div>
    </div>
  );
}

export function PaymentMethods({
  method,
  onMethod,
}: {
  method: PayMethod;
  onMethod: (value: PayMethod) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onMethod("sbp")}
        className={`flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#12141c] text-sm font-medium ${
          method === "sbp" ? "ring-1 ring-[#3b82f6]" : "ring-1 ring-white/10"
        }`}
      >
        <SbpIcon className="h-7 w-7" />
        СБП
      </button>
      <button
        type="button"
        onClick={() => onMethod("crypto")}
        className={`flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#12141c] text-sm font-medium ${
          method === "crypto" ? "ring-1 ring-[#3b82f6]" : "ring-1 ring-white/10"
        }`}
      >
        <BitcoinIcon className="h-6 w-6" />
        Криптовалюта
      </button>
    </div>
  );
}

export function PayButton({
  enabled,
  label,
  pending,
  onClick,
}: {
  enabled: boolean;
  label: string;
  pending: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={!enabled || pending}
      onClick={onClick}
      className={`h-12 w-full rounded-2xl text-base font-semibold ${
        enabled
          ? "bg-[#107c10] text-white"
          : "bg-[#1f3d1c] text-[#7aa56f]"
      } disabled:opacity-80`}
    >
      {pending ? "Отправка…" : label}
    </button>
  );
}

export function QtyStepper({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-full bg-[#152238] px-3 py-1.5 ${
        disabled ? "opacity-40" : "text-[#60a5fa]"
      }`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(Math.max(0, value - 1))}
        className="text-lg leading-none"
      >
        −
      </button>
      <span className="min-w-4 text-center text-sm text-white">{value}</span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(value + 1)}
        className="text-lg leading-none"
      >
        +
      </button>
    </div>
  );
}

export function GuideSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="divide-y divide-white/10">
      {steps.map((step, index) => (
        <li key={step} className="flex gap-3 py-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3b82f6] text-[12px] font-semibold">
            {index + 1}
          </span>
          <span className="text-[13px] leading-5">{step}</span>
        </li>
      ))}
    </ol>
  );
}

export function OrderSuccess() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
      <div className="order-popup flex w-full max-w-xs flex-col items-center rounded-3xl bg-[#12141c] px-6 py-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d4af6a] text-3xl text-[#0a0c12]">
          ✓
        </span>
        <p className="mt-5 text-xl font-semibold">Ваш заказ получен</p>
      </div>
    </div>
  );
}
