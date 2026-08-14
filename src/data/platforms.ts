export type Platform = {
  id: string;
  title: string;
  icon: string;
};

export const platforms: Platform[] = [
  { id: "apple", title: "Apple", icon: "apple" },
  { id: "nintendo", title: "Nintendo", icon: "nintendo" },
  { id: "roblox", title: "Roblox", icon: "roblox" },
  { id: "playstation", title: "PlayStation", icon: "playstation" },
  { id: "steam", title: "Steam", icon: "steam" },
];

export function getPlatformById(id: string): Platform | undefined {
  return platforms.find((platform) => platform.id === id);
}
