export type Game = {
  id: string;
  title: string;
  edition: string;
  platform: "PS5" | "PS4";
  priceRub: number;
  oldPriceRub?: number;
  discount?: number;
  cover: string;
  section: "hits" | "new";
};

export const games: Game[] = [
  {
    id: "spiderman",
    title: "Marvel's Spider-Man Remastered",
    edition: "Русская версия",
    platform: "PS5",
    priceRub: 1395,
    oldPriceRub: 2790,
    discount: 50,
    cover:
      "https://image.api.playstation.com/vulcan/ap/rnd/202009/3021/B2aUYFC0qUAkNnjbTHRyhrg3.png?w=440",
    section: "hits",
  },
  {
    id: "wukong",
    title: "Black Myth: Wukong",
    edition: "Standard",
    platform: "PS5",
    priceRub: 5600,
    oldPriceRub: 8000,
    discount: 30,
    cover:
      "https://image.api.playstation.com/vulcan/ap/rnd/202405/2117/59be402814be4dbf2ba860689f76895fc81510e615c925bd.png?w=512",
    section: "hits",
  },
  {
    id: "gtavi",
    title: "Grand Theft Auto VI",
    edition: "Standard",
    platform: "PS5",
    priceRub: 10495,
    cover:
      "https://image.api.playstation.com/vulcan/ap/rnd/202606/1818/2ebe6fa868c682fcd3d7c5bc866bc95697c02aa4c8f16dc2.jpg?w=512",
    section: "hits",
  },
  {
    id: "helldivers",
    title: "Helldivers 2",
    edition: "Standard",
    platform: "PS5",
    priceRub: 3570,
    oldPriceRub: 4760,
    discount: 25,
    cover:
      "https://image.api.playstation.com/vulcan/ap/rnd/202608/0517/28b306800f7123514cd1888c81d9321b3265ef3ff334399c.jpg?w=512",
    section: "hits",
  },
  {
    id: "lego-batman",
    title: "LEGO Batman: Legacy of the Dark Knight",
    edition: "Standard",
    platform: "PS5",
    priceRub: 4490,
    cover:
      "https://image.api.playstation.com/vulcan/ap/rnd/202508/1316/63c063c243da18279bee5c1bd3e9deabb0a0b535e5af650d.png?w=512",
    section: "new",
  },
  {
    id: "ufc6",
    title: "UFC 6",
    edition: "Ultimate",
    platform: "PS5",
    priceRub: 14025,
    oldPriceRub: 16500,
    discount: 15,
    cover:
      "https://image.api.playstation.com/vulcan/ap/rnd/202604/2217/062d04994b5e270962724a172a640b122b0d4049c8471d05.png?w=512",
    section: "new",
  },
  {
    id: "mkx",
    title: "Mortal Kombat X",
    edition: "Standard",
    platform: "PS4",
    priceRub: 200,
    cover:
      "https://image.api.playstation.com/cdn/EP1018/CUSA00970_00/vdeZDZaLf8qImDoCzZSfyOrfHrds4hdp.png?w=512",
    section: "new",
  },
];

export function getGames(section?: Game["section"]): Game[] {
  return section ? games.filter((item) => item.section === section) : games;
}

export function getGameById(id: string): Game | undefined {
  return games.find((item) => item.id === id);
}

export function searchGames(query: string): Game[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return games;
  }
  return games.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.edition.toLowerCase().includes(q)
  );
}
