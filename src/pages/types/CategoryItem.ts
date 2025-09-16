import type { ItemSizes } from "./CategoryItemsSizes";

export type CategoryItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  img: string;
  categoryId: number;
  hasSizes: boolean;
  sizes?: ItemSizes[];
  sortOrder: number;
  neu: boolean;
  hasBeilagen: boolean;
  allergeneIds: number[];
  zusatzstoffeIds: number[];
  saucenIds: number[];
  hasSaucen: boolean;
};
