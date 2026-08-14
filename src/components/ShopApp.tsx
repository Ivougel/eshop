"use client";

import { useState } from "react";
import { Cabinet } from "@/components/Cabinet";
import { HomeMenu } from "@/components/HomeMenu";
import { OrderWizard } from "@/components/OrderWizard";
import type { ShopEntry } from "@/data/home";

type Screen = "home" | "cabinet" | "shop";

export function ShopApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [entry, setEntry] = useState<ShopEntry | null>(null);

  if (screen === "cabinet") {
    return <Cabinet onBack={() => setScreen("home")} />;
  }

  if (screen === "shop" && entry) {
    return (
      <OrderWizard
        key={`${entry.platformId}-${entry.regionId ?? ""}-${entry.kind}`}
        entry={entry}
        onBack={() => {
          setEntry(null);
          setScreen("home");
        }}
      />
    );
  }

  return (
    <HomeMenu
      onCabinet={() => setScreen("cabinet")}
      onOpen={(next) => {
        setEntry(next);
        setScreen("shop");
      }}
    />
  );
}
