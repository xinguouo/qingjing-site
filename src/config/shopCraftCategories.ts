export const SHOP_CRAFT_CATEGORIES = [
  {
    id: "glass-casting",
    labelEn: "Glass Casting",
    labelZh: "玻璃铸造",
    value: "玻璃铸造",
  },
  {
    id: "glass-blowing",
    labelEn: "Glass Blowing",
    labelZh: "玻璃吹制",
    value: "玻璃吹制",
  },
  {
    id: "lampworking",
    labelEn: "Lampworking",
    labelZh: "玻璃灯工",
    value: "玻璃灯工",
  },
  {
    id: "cold-working",
    labelEn: "Cold Working",
    labelZh: "玻璃冷加工",
    value: "玻璃冷加工",
  },
  {
    id: "glass-mosaic",
    labelEn: "Glass Mosaic",
    labelZh: "玻璃马赛克",
    value: "玻璃马赛克",
  },
  {
    id: "stained-glass",
    labelEn: "Stained Glass",
    labelZh: "玻璃镶嵌",
    value: "玻璃镶嵌",
  },
  {
    id: "glass-painting",
    labelEn: "Glass Painting",
    labelZh: "玻璃绘画",
    value: "玻璃绘画",
  },
] as const;

export type ShopCraftCategoryId = (typeof SHOP_CRAFT_CATEGORIES)[number]["id"];
export type ShopCraftCategoryValue =
  (typeof SHOP_CRAFT_CATEGORIES)[number]["value"];

export function getShopCraftCategoryByInput(
  input: string | null | undefined,
) {
  const value = input?.trim();

  if (!value) {
    return null;
  }

  return (
    SHOP_CRAFT_CATEGORIES.find(
      (item) =>
        item.id === value ||
        item.value === value ||
        item.labelZh === value ||
        item.labelEn === value,
    ) || null
  );
}

export function normalizeShopCraftCategoryId(
  input: string | null | undefined,
) {
  return getShopCraftCategoryByInput(input)?.id || "";
}
