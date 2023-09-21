import { Product } from "@/types";
import { create } from "zustand";

interface CheckoutFormStore {
  isOpen: boolean;
  productIds: string[];
  totalPrice: string;
  onOpen: (productIds: string[], totalPrice: string) => void;
  onClose: () => void;
}

const useCheckoutForm = create<CheckoutFormStore>((set) => ({
  isOpen: false,
  productIds: [],
  totalPrice: "",
  onOpen: (productIds: string[], totalPrice: string) => set({ productIds, totalPrice, isOpen: true }),
  onClose: () => set({ isOpen: false })
}))

export default useCheckoutForm;