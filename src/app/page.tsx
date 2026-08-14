"use client";

import dynamic from "next/dynamic";

const ShopApp = dynamic(
  () => import("@/components/ShopApp").then((mod) => mod.ShopApp),
  {
    ssr: false,
    loading: () => <div className="min-h-dvh bg-[#08090c]" />,
  }
);

export default function Home() {
  return <ShopApp />;
}
