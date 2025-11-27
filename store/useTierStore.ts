import { create } from "zustand";

export type Tier = {
  name: string;
  items: string[];
};

interface TierStore {
  tiers: Tier[];
  addToTier: (tierName: string, item: string) => void;
  removeFromTier: (tierName: string, item: string) => void;
  moveItem: (fromTier: string, toTier: string, item: string) => void;
  addTier: (tierName: string) => void;
  removeTier: (tierName: string) => void;
}

export const useTierStore = create<TierStore>((set) => ({
  tiers: [
    { name: "S Tier", items: ["stier"] },
    { name: "A Tier", items: ["atier"] },
    { name: "B Tier", items: ["btier", "test"] },
    { name: "C Tier", items: ["ctier"] },
    { name: "D Tier", items: ["dtier"] },
  ],

  addToTier: (tierName, item) => {
    set((state) => ({
      tiers: state.tiers.map((tier) =>
        tier.name === tierName
          ? { ...tier, items: [...tier.items, item] }
          : tier
      ),
    }));
  },

  removeFromTier: (tierName, item) => {
    set((state) => ({
      tiers: state.tiers.map((tier) =>
        tier.name === tierName
          ? { ...tier, items: tier.items.filter((i) => i !== item) }
          : tier
      ),
    }));
  },

  moveItem: (fromTier, toTier, item) => {
    set((state) => ({
      tiers: state.tiers.map((tier) => {
        if (tier.name === fromTier) {
          return { ...tier, items: tier.items.filter((i) => i !== item) };
        } else if (tier.name === toTier) {
          return { ...tier, items: [...tier.items, item] };
        }
        return tier;
      }),
    }));
  },
  addTier: (tierName) => {
    set((state) => ({
      tiers: [...state.tiers, { name: tierName, items: [] }],
    }));
  },
  removeTier: (tierName) => {
    set((state) => ({
      tiers: state.tiers.filter((tier) => tier.name !== tierName),
    }));
  },
}));
