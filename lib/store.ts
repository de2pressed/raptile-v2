import { create } from "zustand";

export interface CartLine {
  id: string;
  quantity: number;
  title: string;
  variantTitle: string;
  merchandiseId: string;
  price: string;
  imageUrl?: string;
  imageAlt?: string | null;
}

interface RaptileStore {
  cartId: string | null;
  cartLines: CartLine[];
  cartTotal: string;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setCartData: (payload: { cartId: string | null; cartLines: CartLine[]; cartTotal: string }) => void;
  isSpecDrawerOpen: boolean;
  setSpecDrawerOpen: (open: boolean) => void;
  selectedVariantId: string | null;
  setSelectedVariant: (id: string | null) => void;
}

export const useRaptileStore = create<RaptileStore>((set) => ({
  cartId: null,
  cartLines: [],
  cartTotal: "₹0",
  isCartOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  setCartData: ({ cartId, cartLines, cartTotal }) => set({ cartId, cartLines, cartTotal }),
  isSpecDrawerOpen: false,
  setSpecDrawerOpen: (open) => set({ isSpecDrawerOpen: open }),
  selectedVariantId: null,
  setSelectedVariant: (id) => set({ selectedVariantId: id }),
}));
