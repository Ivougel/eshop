export type ShopKind = "subscriptions" | "cards" | "plans";

export type ShopEntry = {
  platformId: string;
  platformTitle: string;
  kind: ShopKind;
  regionId?: string;
  regionIds?: string[];
};

export type HomeRegion = {
  id: string;
  regionId: string;
  title: string;
  flagIcon: string;
  badge: string;
  description: string;
};

export type HomeService = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badge?: { label: string; tone: "green" | "blue" };
  entry: ShopEntry;
};

export const homeRegions: HomeRegion[] = [
  {
    id: "tr",
    regionId: "tr",
    title: "Турция",
    flagIcon: "🇹🇷",
    badge: "Популярный",
    description: "Лучшие цены на проверенную классику и хиты прошлых лет",
  },
  {
    id: "in",
    regionId: "in",
    title: "Индия",
    flagIcon: "🇮🇳",
    badge: "Удобный",
    description: "Пополнение через карты",
  },
];

export const homeServices: HomeService[] = [
  {
    id: "xbox",
    title: "Xbox Game Pass",
    subtitle: "Ultimate · на свой или новый аккаунт",
    icon: "xbox",
    badge: { label: "NEW", tone: "green" },
    entry: {
      platformId: "xbox",
      platformTitle: "Xbox Game Pass",
      kind: "plans",
    },
  },
  {
    id: "steam",
    title: "Steam",
    subtitle: "Пополните свой Steam-кошелек",
    icon: "steam",
    entry: {
      platformId: "steam",
      platformTitle: "Steam",
      kind: "cards",
    },
  },
  {
    id: "psn-codes",
    title: "Коды пополнения PSN",
    subtitle: "Турция · Индия · США",
    icon: "playstation",
    entry: {
      platformId: "playstation",
      platformTitle: "Коды пополнения PSN",
      kind: "cards",
      regionIds: ["tr", "in", "us"],
    },
  },
  {
    id: "roblox",
    title: "Roblox",
    subtitle: "Пополняй баланс Robux",
    icon: "roblox",
    entry: {
      platformId: "roblox",
      platformTitle: "Roblox",
      kind: "cards",
    },
  },
  {
    id: "apple",
    title: "App Store",
    subtitle: "Карты пополнения · США, Турция, Индия",
    icon: "apple",
    entry: {
      platformId: "apple",
      platformTitle: "App Store",
      kind: "cards",
      regionIds: ["us", "tr", "in"],
    },
  },
  {
    id: "ai",
    title: "Нейросети",
    subtitle: "ChatGPT и Claude · подписки на месяц",
    icon: "ai",
    badge: { label: "NEW", tone: "blue" },
    entry: {
      platformId: "ai",
      platformTitle: "Нейросети",
      kind: "plans",
    },
  },
];

export const homeChannels = [
  {
    id: "channel",
    title: "Канал",
    subtitle: "Новости, скидки, релизы",
    href: "https://t.me/icity_eshop_bot",
    icon: "telegram",
  },
  {
    id: "support",
    title: "Поддержка",
    subtitle: "Помощь по заказам",
    href: "https://t.me/icity_eshop_bot",
    icon: "chat",
  },
  {
    id: "reviews",
    title: "Отзывы",
    subtitle: "Опыт клиентов",
    href: "https://t.me/icity_eshop_bot",
    icon: "star",
  },
];

export function shopEntryForRegion(regionId: string): ShopEntry {
  const region = homeRegions.find((item) => item.regionId === regionId);
  return {
    platformId: "playstation",
    platformTitle: `PlayStation · ${region?.title ?? regionId}`,
    kind: "subscriptions",
    regionId,
  };
}
