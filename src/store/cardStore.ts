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
  hasSizes: boolean;
  selectedSize?: string | undefined;
  totalPrice: number;
  anmerkung?: string | undefined;
  hasBeilagen?: boolean;
  beilagen?: string[] | undefined;
  beilagenPreis?: number | undefined;
  allergeneIds?: number[] | undefined;
  zusatzstoffeIds?: number[] | undefined;
}

export interface LiefernAbholen {
  liefern: boolean;
  abholen: boolean;
}

export interface BeilagenName {
  id: number;
  beilageName: string;
}

export interface BeilagenPreise {
  id: number;
  kleinpreis: number;
  mittelpreis: number;
  grosspreis: number;
  familiepreis: number;
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    genericCartItems: [] as GenericCartItem[],
    liefernAbholen: {
      liefern: true,
      abholen: false,
    } as LiefernAbholen,
  }),
  getters: {
    getLiefernAbholen: (state) => state.liefernAbholen,
  },
  actions: {
    setLiefernAbholen(item: LiefernAbholen) {
      this.liefernAbholen = { ...item };
    },

    addGenericToCart(item: GenericCartItem) {
      const existingItem = this.genericCartItems.find(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.categoryName === item.categoryName &&
          cartItem.selectedSize === item.selectedSize &&
          (cartItem.anmerkung || "") === (item.anmerkung || "") &&
          cartItem.beilagen === item.beilagen &&
          cartItem.beilagenPreis === item.beilagenPreis &&
          cartItem.allergeneIds === item.allergeneIds &&
          cartItem.zusatzstoffeIds === item.zusatzstoffeIds
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
      originalSize: string | undefined,
      newQuantity: number,
      newSelectedSize?: string,
      anmerkung?: string,
      newPrice?: number
    ) {
      const item = this.genericCartItems.find(
        (cartItem) =>
          cartItem.id === id &&
          cartItem.categoryName === categoryName &&
          cartItem.selectedSize === originalSize
      );

      if (item && newQuantity >= 1) {
        item.quantity = newQuantity;
        item.selectedSize = newSelectedSize;
        item.anmerkung = anmerkung;
        if (newPrice !== undefined) {
          item.price = newPrice;
        }
        item.totalPrice = item.price * newQuantity;
      }
    },

    updateOrReplaceGenericCartItem(
      id: number,
      categoryName: string,
      originalSize: string | undefined,
      newQuantity: number,
      newSelectedSize: string | undefined,
      anmerkung: string | undefined,
      newPrice: number
    ) {
      const oldItemIndex = this.genericCartItems.findIndex(
        (cartItem) =>
          cartItem.id === id &&
          cartItem.categoryName === categoryName &&
          cartItem.selectedSize === originalSize
      );

      if (oldItemIndex !== -1) {
        const oldItem = this.genericCartItems[oldItemIndex];

        oldItem!.quantity = newQuantity;
        oldItem!.selectedSize = newSelectedSize;
        oldItem!.anmerkung = anmerkung;
        oldItem!.price = newPrice;
        oldItem!.totalPrice = newPrice * newQuantity;
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
