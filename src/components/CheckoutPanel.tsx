"use client";

import { useState } from "react";
import { OrderSuccess } from "@/components/shop/ShopChrome";
import { SbpIcon } from "@/components/icons";
import { submitOrder, type CreatedOrder } from "@/lib/submit-order";

type Props = {
  platformTitle: string;
  regionTitle: string;
  label: string;
  priceRub: number;
  onBack: () => void;
  onHome: () => void;
};

export function CheckoutPanel({
  platformTitle,
  regionTitle,
  label,
  priceRub,
  onBack,
  onHome,
}: Props) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState<CreatedOrder | null>(null);

  async function pay() {
    setError("");
    setPending(true);
    const result = await submitOrder({
      platform: platformTitle,
      region: regionTitle,
      denomination: label,
      priceRub,
    });
    setPending(false);
    if (!result.ok || !result.order) {
      setError(result.error ?? "Не удалось оформить заказ");
      return;
    }
    setCreated(result.order);
  }

  if (created) {
    return <OrderSuccess orderId={created.orderId} onDone={onHome} />;
  }

  return (
    <div className="px-[22px] pt-2 pb-[max(48px,calc(24px+env(safe-area-inset-bottom)))]">
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
        {error ? (
          <p className="mt-3 text-sm text-[#ff5a5a]" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="button"
          disabled={pending}
          onClick={() => void pay()}
          className="mt-4 inline-flex h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#d4af6a] to-[#e8c47e] px-4 text-base font-semibold text-[#0a0c12] disabled:opacity-60"
        >
          <SbpIcon className="h-7 w-7" />
          {pending ? "Отправка…" : "Оплатить"}
        </button>
      </div>
    </div>
  );
}
