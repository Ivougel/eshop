"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  closeMiniApp,
  getTelegramInitData,
  getTelegramUserId,
  getTelegramUsername,
} from "@/components/TelegramInit";
import { SbpIcon } from "@/components/icons";

const USERNAME_RE = /^[A-Za-z0-9_]{5,32}$/;

type Props = {
  platformTitle: string;
  regionTitle: string;
  label: string;
  priceRub: number;
  onBack: () => void;
};

export function CheckoutPanel({
  platformTitle,
  regionTitle,
  label,
  priceRub,
  onBack,
}: Props) {
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fromTelegram = getTelegramUsername();
    if (fromTelegram) {
      setUsername(fromTelegram);
    }
  }, []);

  useEffect(() => {
    if (!success) {
      return;
    }
    const timer = window.setTimeout(() => closeMiniApp(), 2200);
    return () => window.clearTimeout(timer);
  }, [success]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const telegramUsername = username.trim().replace(/^@/, "");
    if (!USERNAME_RE.test(telegramUsername)) {
      setError("Username: латиница, цифры и _, от 5 до 32 символов, без @");
      return;
    }

    setError("");
    setPending(true);

    try {
      let telegramUserId = getTelegramUserId();
      if (!telegramUserId) {
        for (let attempt = 0; attempt < 12 && !telegramUserId; attempt += 1) {
          await new Promise((resolve) => window.setTimeout(resolve, 80));
          telegramUserId = getTelegramUserId();
        }
      }

      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: platformTitle,
          region: regionTitle,
          denomination: label,
          priceRub,
          telegramUsername,
          telegramUserId,
          telegramInitData: getTelegramInitData(),
        }),
      });

      const data: { success?: boolean; error?: string } = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error ?? "Не удалось оформить заказ");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Не удалось оформить заказ");
    } finally {
      setPending(false);
    }
  }

  if (success) {
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

  return (
    <div className="px-[22px] pb-8 pt-2">
      <button type="button" onClick={onBack} className="text-sm text-[#8a92a8]">
        ← Назад
      </button>
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <p className="text-sm text-[#8a92a8]">{platformTitle}</p>
        <p className="mt-1 text-base font-medium">{label}</p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <p className="text-sm text-[#8a92a8]">К оплате</p>
          <p className="text-2xl font-semibold tracking-tight">
            {priceRub.toLocaleString("ru-RU")} ₽
          </p>
        </div>

        {!showUsernameForm ? (
          <button
            type="button"
            onClick={() => setShowUsernameForm(true)}
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#d4af6a] to-[#e8c47e] px-4 text-base font-semibold text-[#0a0c12]"
          >
            <SbpIcon className="h-7 w-7" />
            Оплатить по СБП
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4">
            <label className="block">
              <span className="mb-1.5 block text-sm text-white/70">
                Ваш Telegram username
              </span>
              <input
                type="text"
                name="telegramUsername"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value.replace(/^@/, ""))
                }
                placeholder="username"
                autoComplete="username"
                required
                className="h-12 w-full rounded-xl border border-white/10 bg-[#08090c] px-3 text-base outline-none focus:border-[#d4af6a]"
              />
            </label>
            {error ? (
              <p className="mt-2 text-sm text-[#ff5a5a]" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={pending}
              className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#d4af6a] to-[#e8c47e] text-base font-semibold text-[#0a0c12] disabled:opacity-60"
            >
              {pending ? "Отправка…" : "Отправить заявку"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
