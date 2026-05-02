import { create } from "zustand";

export interface CartLine {
  id: string;
  quantity: number;
  title: string;
  handle: string;
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
  lastAddedMerchandiseId: string | null;
  setLastAddedMerchandiseId: (id: string | null) => void;
  isSpecDrawerOpen: boolean;
  setSpecDrawerOpen: (open: boolean) => void;
  selectedVariantId: string | null;
  setSelectedVariant: (id: string | null) => void;
  isCollectionSearchVisible: boolean;
  setCollectionSearchVisible: (visible: boolean) => void;
}

export const useRaptileStore = create<RaptileStore>((set) => ({
  cartId: null,
  cartLines: [],
  cartTotal: "INR 0",
  isCartOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  setCartData: ({ cartId, cartLines, cartTotal }) => set({ cartId, cartLines, cartTotal }),
  lastAddedMerchandiseId: null,
  setLastAddedMerchandiseId: (id) => set({ lastAddedMerchandiseId: id }),
  isSpecDrawerOpen: false,
  setSpecDrawerOpen: (open) => set({ isSpecDrawerOpen: open }),
  selectedVariantId: null,
  setSelectedVariant: (id) => set({ selectedVariantId: id }),
  isCollectionSearchVisible: false,
  setCollectionSearchVisible: (visible) => set({ isCollectionSearchVisible: visible }),
}));
