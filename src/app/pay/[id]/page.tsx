import { getOrder } from "@/lib/orders";
import { botUrl } from "@/data/home";

export default async function PayPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string; sum?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const orderId = Number(id);
  const stored = Number.isFinite(orderId) ? getOrder(orderId) : undefined;
  const priceRub = stored?.priceRub ?? Number(query.sum);
  const found = Boolean(stored) || Number.isFinite(priceRub);

  return (
    <div className="px-5 pt-10 pb-10">
      <div className="rounded-[28px] border border-white/10 bg-[#12141c] px-6 py-8 text-center">
        <p className="text-[12px] tracking-[0.16em] text-[#8a92a8] uppercase">
          Оплата заказа
        </p>
        <h1 className="mt-3 text-[26px] font-semibold">
          {Number.isFinite(orderId) ? `№${orderId}` : "Заказ"}
        </h1>
        {found ? (
          <>
            <p className="mt-4 text-[32px] font-semibold text-[#d4af6a]">
              {Number(priceRub).toLocaleString("ru-RU")} ₽
            </p>
            <p className="mt-4 text-[13px] leading-5 text-[#8a92a8]">
              Ссылка на оплату одноразовая. Если она истекла — нажмите «Обновить»
              в чате с ботом.
            </p>
            <a
              href={botUrl}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#e2c27d] text-base font-semibold text-[#1a1408]"
            >
              Написать боту
            </a>
          </>
        ) : (
          <p className="mt-4 text-[13px] leading-5 text-[#8a92a8]">
            Откройте магазин в Telegram и оформите заказ заново.
          </p>
        )}
      </div>
    </div>
  );
}
