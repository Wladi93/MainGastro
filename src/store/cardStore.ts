import { defineStore } from "pinia";

export interface ItemSizes {
  sizeName: string;
  price: number;
  categoryItemId: number;
}
export interface GenericCartItem {
  id: number;
  name: string;
  description: string;
  img: string;
  price: number;
  quantity: number;
  categoryName: string;
  sizes?: ItemSizes[];
  hasSizes?: boolean;
  selectedSize?: string | undefined;
  totalPrice: number;
  anmerkung?: string;
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    genericCartItems: [] as GenericCartItem[],
  }),
  getters: {},
  actions: {
    addGenericToCart(item: GenericCartItem) {
      const existingItem = this.genericCartItems.find(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.categoryName === item.categoryName &&
          cartItem.selectedSize === item.selectedSize &&
          cartItem.anmerkung === item.anmerkung
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.totalPrice += item.totalPrice;
      } else {
        this.genericCartItems.push({ ...item });
      }
    },

    removeGenericFromCart(
      id: number,
      categoryName: string,
      selectedSize?: string
    ) {
      const item = this.genericCartItems.find(
        (cartItem) =>
          cartItem.id === id &&
          cartItem.categoryName === categoryName &&
          cartItem.selectedSize === selectedSize
      );

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
          item.totalPrice = item.price * item.quantity;
        } else {
          const index = this.genericCartItems.indexOf(item);
          if (index !== -1) {
            this.genericCartItems.splice(index, 1);
          }
        }
      }
    },

    updateGenericCartItem(
      id: number,
      categoryName: string,
      newQuantity: number,
      selectedSize?: string,
      anmerkung?: string
    ) {
      const item = this.genericCartItems.find(
        (cartItem) =>
          cartItem.id === id &&
          cartItem.categoryName === categoryName &&
          cartItem.selectedSize === selectedSize &&
          cartItem.anmerkung === anmerkung
      );

      if (item && newQuantity >= 1) {
        item.quantity = newQuantity;
        item.totalPrice = item.price * newQuantity;
      }
    },

    deleteGenericCartItem(
      id: number,
      categoryName: string,
      selectedSize?: string
    ) {
      const index = this.genericCartItems.findIndex(
        (cartItem) =>
          cartItem.id === id &&
          cartItem.categoryName === categoryName &&
          cartItem.selectedSize === selectedSize
      );

      if (index !== -1) {
        this.genericCartItems.splice(index, 1);
      }
    },

    clearCart() {
      this.genericCartItems.splice(0, this.genericCartItems.length);
    },
  },
  persist: true,
});
