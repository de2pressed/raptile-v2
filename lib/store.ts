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
  scrollVelocity: number;
  setScrollVelocity: (velocity: number) => void;
  mouseX: number;
  mouseY: number;
  scrollY: number;
  setMousePosition: (x: number, y: number) => void;
  setScrollY: (y: number) => void;
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
  scrollVelocity: 0,
  setScrollVelocity: (velocity) => set({ scrollVelocity: velocity }),
  mouseX: 0,
  mouseY: 0,
  scrollY: 0,
  setMousePosition: (mouseX, mouseY) => set({ mouseX, mouseY }),
  setScrollY: (scrollY) => set({ scrollY }),
  isSpecDrawerOpen: false,
  setSpecDrawerOpen: (open) => set({ isSpecDrawerOpen: open }),
  selectedVariantId: null,
  setSelectedVariant: (id) => set({ selectedVariantId: id }),
}));
