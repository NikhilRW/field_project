import { DonationCategory } from "../utils/api";

export const MAX_CHART_HEIGHT = 90;
export const categoryLabels: Record<DonationCategory, string> = {
  money: "Money",
  books: "Books",
  clothes: "Clothes",
  grocery: "Grocery",
  other_items: "Other items",
};