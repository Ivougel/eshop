export type Region = {
  id: string;
  title: string;
  flagIcon: string;
};

export const regions: Region[] = [
  { id: "tr", title: "Турция", flagIcon: "🇹🇷" },
  { id: "in", title: "Индия", flagIcon: "🇮🇳" },
  { id: "pl", title: "Польша", flagIcon: "🇵🇱" },
  { id: "us", title: "США", flagIcon: "🇺🇸" },
  { id: "gb", title: "Великобритания", flagIcon: "🇬🇧" },
  { id: "kz", title: "Казахстан", flagIcon: "🇰🇿" },
  { id: "de", title: "Германия", flagIcon: "🇩🇪" },
];

export function getRegionById(id: string): Region | undefined {
  return regions.find((region) => region.id === id);
}
