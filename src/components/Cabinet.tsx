"use client";

import { useEffect, useState } from "react";
import {
  BagIcon,
  ChevronIcon,
  CopyIcon,
  InfoIcon,
  KeyIcon,
  NavHeartIcon,
  NavProfileIcon,
  UsersIcon,
  WalletIcon,
} from "@/components/icons";
import {
  getTelegramDisplayName,
  getTelegramUser,
  getTelegramUserId,
} from "@/components/TelegramInit";
import { botUrl, botUsername, homeRegions } from "@/data/home";
import {
  formatHistorySum,
  formatHistoryWhen,
  loadOrderHistory,
  type HistoryOrder,
} from "@/lib/order-history";

const PSN_KEY = "icity-psn-account";

type PsnAccount = {
  regionId: "tr" | "in";
  login: string;
  password: string;
};

type View = "main" | "history" | "referral" | "codes";

type Props = {
  regionId?: string;
  onFavorites: () => void;
};

function loadPsn(fallbackRegion: "tr" | "in"): PsnAccount {
  try {
    const raw = window.localStorage.getItem(PSN_KEY);
    if (!raw) {
      return { regionId: fallbackRegion, login: "", password: "" };
    }
    const parsed = JSON.parse(raw) as Partial<PsnAccount>;
    return {
      regionId: parsed.regionId === "in" ? "in" : "tr",
      login: parsed.login ?? "",
      password: parsed.password ?? "",
    };
  } catch {
    return { regionId: fallbackRegion, login: "", password: "" };
  }
}

function savePsn(value: PsnAccount) {
  window.localStorage.setItem(PSN_KEY, JSON.stringify(value));
}

export function Cabinet({ regionId = "tr", onFavorites }: Props) {
  const [name, setName] = useState("Гость");
  const [userId, setUserId] = useState<number | undefined>();
  const [psn, setPsn] = useState<PsnAccount>({
    regionId: regionId === "in" ? "in" : "tr",
    login: "",
    password: "",
  });
  const [psnOpen, setPsnOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<View>("main");
  const [orders, setOrders] = useState<HistoryOrder[]>([]);

  useEffect(() => {
    setName(getTelegramDisplayName());
    setUserId(getTelegramUserId() ?? getTelegramUser()?.id);
    setPsn(loadPsn(regionId === "in" ? "in" : "tr"));
    setOrders(loadOrderHistory());
  }, [regionId]);

  const letter = (name.trim()[0] ?? "?").toUpperCase();
  const start = userId ? String(userId) : "guest";
  const referralPath = `t.me/${botUsername}?start=${start}`;
  const referralUrl = `https://${referralPath}`;

  function updatePsn(next: PsnAccount) {
    setPsn(next);
    savePsn(next);
  }

  async function copyReferral() {
    try {
      await navigator.clipboard.writeText(referralUrl);
    } catch {
      const field = document.createElement("textarea");
      field.value = referralUrl;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  if (view === "history") {
    return <HistoryView orders={orders} onBack={() => setView("main")} />;
  }

  if (view !== "main") {
    return (
      <StubView
        title={view === "codes" ? "Резервные коды" : "Реферальная программа"}
        text={
          view === "codes"
            ? "Скоро можно будет сохранить резервные коды PSN. Пока это заглушка."
            : "Скоро здесь будет статистика приглашений и начисления 3% с покупок друзей."
        }
        onBack={() => setView("main")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex flex-col items-center pt-2">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e8a070] text-2xl font-semibold text-white">
          {letter}
        </span>
        <h1 className="mt-3 text-xl font-semibold">{name}</h1>
        <p className="mt-1 text-[13px] text-[#8a92a8]">
          {userId ? `ID ${userId}` : "Откройте Mini App в Telegram"}
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-[#8a92a8] uppercase">
          Бонусный баланс
        </p>
        <p className="mt-2 text-[32px] leading-none font-semibold">50 ₽</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-black/30 px-3 py-2.5">
            <p className="text-[10px] tracking-[0.12em] text-[#8a92a8] uppercase">
              Кэшбэк
            </p>
            <p className="mt-1 text-[13px]">
              <span className="font-semibold text-[#d4af6a]">3%</span> с покупки
            </p>
          </div>
          <div className="rounded-xl bg-black/30 px-3 py-2.5">
            <p className="text-[10px] tracking-[0.12em] text-[#8a92a8] uppercase">
              С друга
            </p>
            <p className="mt-1 text-[13px]">
              <span className="font-semibold text-[#d4af6a]">3%</span> бонус
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#d4af6a]/25 bg-white/[0.04] p-4 shadow-[0_0_28px_rgba(212,175,106,0.12)]">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d4af6a]/15 text-[#d4af6a]">
            <WalletIcon className="h-4 w-4" />
          </span>
          <div>
            <p className="font-semibold">Реферальная программа</p>
            <p className="mt-0.5 text-[13px] text-[#8a92a8]">
              Приглашай друзей — получай бонусы
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-black/35 py-1.5 pr-1.5 pl-3">
          <p className="min-w-0 flex-1 truncate text-[12px] text-[#cfd3dc]">
            {referralPath}
          </p>
          <button
            type="button"
            onClick={() => void copyReferral()}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#d4af6a] px-2.5 py-1.5 text-[10px] font-semibold tracking-[0.08em] text-[#d4af6a] uppercase"
          >
            <CopyIcon className="h-3.5 w-3.5" />
            {copied ? "Готово" : "Копировать"}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setView("referral")}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left"
        >
          <p className="text-[22px] font-semibold text-[#d4af6a]">0</p>
          <p className="mt-1 flex items-center justify-between text-[12px] text-[#8a92a8]">
            Приглашённых друзей
            <ChevronIcon className="h-3.5 w-3.5" />
          </p>
        </button>
        <button
          type="button"
          onClick={() => setView("referral")}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left"
        >
          <p className="text-[22px] font-semibold text-[#d4af6a]">0 ₽</p>
          <p className="mt-1 text-[12px] text-[#8a92a8]">Заработано с рефералов</p>
        </button>
      </div>

      <section>
        <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-[#8a92a8] uppercase">
          Аккаунт PSN
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <button
            type="button"
            onClick={() => setPsnOpen((value) => !value)}
            className="flex w-full items-center gap-2 text-left"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b82f6]/20 text-[#60a5fa]">
              <NavProfileIcon className="h-4 w-4" />
            </span>
            <span className="flex-1 font-medium">Данные для заказов</span>
            <span className="text-[#8a92a8]">{psnOpen ? "⌃" : "⌄"}</span>
          </button>
          {psnOpen ? (
            <div className="mt-4 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                {homeRegions.map((item) => {
                  const selected = item.regionId === psn.regionId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        updatePsn({
                          ...psn,
                          regionId: item.regionId === "in" ? "in" : "tr",
                        })
                      }
                      className={`rounded-xl py-2.5 text-sm font-medium ${
                        selected
                          ? "bg-gradient-to-r from-[#d4af6a] to-[#e8c47e] text-[#0a0c12] shadow-[0_0_16px_rgba(212,175,106,0.35)]"
                          : "bg-white/[0.06] text-[#cfd3dc]"
                      }`}
                    >
                      <span className="mr-1.5">{item.flagIcon}</span>
                      {item.title}
                    </button>
                  );
                })}
              </div>
              <label className="block">
                <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-[#8a92a8] uppercase">
                  Логин (e-mail)
                </span>
                <input
                  type="email"
                  value={psn.login}
                  onChange={(event) =>
                    updatePsn({ ...psn, login: event.target.value })
                  }
                  placeholder="example@gmail.com"
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#08090c] px-3 text-sm outline-none focus:border-[#d4af6a]"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-[#8a92a8] uppercase">
                  Пароль
                </span>
                <input
                  type="password"
                  value={psn.password}
                  onChange={(event) =>
                    updatePsn({ ...psn, password: event.target.value })
                  }
                  placeholder="Пароль от PSN"
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#08090c] px-3 text-sm outline-none focus:border-[#d4af6a]"
                />
              </label>
              <button
                type="button"
                onClick={() => setView("codes")}
                className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-3"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d4af6a]/15 text-[#d4af6a]">
                  <KeyIcon className="h-4 w-4" />
                </span>
                <span className="flex-1 text-left text-sm">Резервные коды</span>
                <ChevronIcon className="h-4 w-4 text-white/35" />
              </button>
              <p className="flex items-start gap-2 text-[12px] leading-4 text-[#60a5fa]">
                <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
                Бот запомнит данные и автоматически использует при оформлении
                заказа
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section>
        <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-[#8a92a8] uppercase">
          Меню
        </p>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <MenuRow
            icon={
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff5a5a]/15 text-[#ff5a5a]">
                <NavHeartIcon className="h-4 w-4" />
              </span>
            }
            title="Избранное"
            subtitle="Сохранённые игры"
            onClick={onFavorites}
          />
          <div className="h-px bg-white/10" />
          <MenuRow
            icon={
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b82f6]/15 text-[#60a5fa]">
                <BagIcon className="h-4 w-4" />
              </span>
            }
            title="История покупок"
            subtitle={
              orders.length
                ? `${orders.length} ${orderWord(orders.length)}`
                : "Все ваши заказы"
            }
            onClick={() => setView("history")}
          />
        </div>
      </section>

      <section>
        <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-[#8a92a8] uppercase">
          Помощь
        </p>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <MenuRow
            icon={
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f59e0b]/15 text-[#f59e0b]">
                <span className="text-sm">💬</span>
              </span>
            }
            title="Поддержка"
            subtitle="Связаться с менеджером"
            href={botUrl}
          />
          <div className="h-px bg-white/10" />
          <MenuRow
            icon={
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8b5cf6]/15 text-[#a78bfa]">
                <UsersIcon className="h-4 w-4" />
              </span>
            }
            title="Сообщество"
            subtitle="Телеграм-канал"
            href={botUrl}
          />
        </div>
      </section>
    </div>
  );
}

function MenuRow({
  icon,
  title,
  subtitle,
  href,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href?: string;
  onClick?: () => void;
}) {
  const body = (
    <>
      {icon}
      <span className="flex-1">
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-[12px] text-[#8a92a8]">{subtitle}</span>
      </span>
      <ChevronIcon className="h-4 w-4 text-white/35" />
    </>
  );
  const className = "flex w-full items-center gap-3 px-3 py-3 text-left";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {body}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {body}
    </button>
  );
}

function HistoryView({
  orders,
  onBack,
}: {
  orders: HistoryOrder[];
  onBack: () => void;
}) {
  return (
    <div className="pt-2">
      <button type="button" onClick={onBack} className="text-sm text-[#8a92a8]">
        ← Назад
      </button>
      <h1 className="mt-4 text-xl font-semibold">История покупок</h1>
      {orders.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-5 text-[#8a92a8]">
          Пока нет заказов — они появятся здесь после оформления.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {orders.map((order) => (
            <article
              key={order.orderId}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold">Заказ №{order.orderId}</p>
                <p className="shrink-0 text-sm font-semibold text-[#d4af6a]">
                  {formatHistorySum(order.priceRub)}
                </p>
              </div>
              <p className="mt-1 text-[13px] text-[#cfd3dc]">
                {order.platform} · {order.denomination}
              </p>
              <p className="mt-0.5 text-[12px] text-[#8a92a8]">
                {order.region} · {formatHistoryWhen(order.createdAt)}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function orderWord(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return "заказ";
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return "заказа";
  }
  return "заказов";
}

function StubView({
  title,
  text,
  onBack,
}: {
  title: string;
  text: string;
  onBack: () => void;
}) {
  return (
    <div className="pt-2">
      <button type="button" onClick={onBack} className="text-sm text-[#8a92a8]">
        ← Назад
      </button>
      <h1 className="mt-4 text-xl font-semibold">{title}</h1>
      <p className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-5 text-[#8a92a8]">
        {text}
      </p>
    </div>
  );
}
