import type { CategoryItem } from "./CategoryItem";

export type Category = {
  id: number;
  name: string;
  icon: string;
  apiEndpoint: string;
  bannerImage: string;
  categoryItem?: CategoryItem[];
  sortOrder: number;
};
