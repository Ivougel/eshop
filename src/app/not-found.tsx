import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-2xl bg-[#1c1c1f] p-6 text-center">
      <h1 className="text-xl font-semibold">Страница не найдена</h1>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#ff4d6d] to-[#ff9a3c] px-5 text-sm font-medium text-white"
      >
        На главную
      </Link>
    </div>
  );
}
