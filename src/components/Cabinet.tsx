"use client";

import { useEffect, useState } from "react";
import { getTelegramUsername } from "@/components/TelegramInit";

export function Cabinet({ onBack }: { onBack: () => void }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fromTelegram = getTelegramUsername();
    if (fromTelegram) {
      setUsername(fromTelegram);
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={onBack}
        className="self-start text-sm text-white/70"
      >
        ← Меню
      </button>
      <h1 className="text-xl font-semibold">Кабинет</h1>
      <div className="rounded-2xl bg-[#1c1c1e] p-4">
        <p className="text-sm text-white/50">Бонусы</p>
        <p className="mt-1 text-2xl font-semibold text-[#c9b07a]">50 ₽</p>
      </div>
      <div className="rounded-2xl bg-[#1c1c1e] p-4">
        <p className="text-sm text-white/50">Telegram</p>
        <p className="mt-1 text-base font-medium">
          {username ? `@${username}` : "Откройте Mini App в Telegram"}
        </p>
      </div>
    </div>
  );
}
