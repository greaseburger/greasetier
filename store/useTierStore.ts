import { create } from "zustand";
import { Tiers, Tier, TierItem } from "@/lib/types";
import { arrayMove } from "@dnd-kit/sortable";
import { persist } from "zustand/middleware";

interface TierStore {
  tiersData: Tiers;
  setTiers: (tiers: Tiers) => void;
  findContainer: (id: string) => Tier | TierItem | undefined;
  sortItem: (tierId: string, activeId: string, overId: string) => void;
  moveItem: (
    tierId: string,
    toTierId: string,
    activeId: string,
    overId: string
  ) => void;
  addItem: (tierId: string, item: TierItem) => void;
}

const initialData = [
  {
    id: "tier-1",
    name: "tierA",
    items: [
      // { id: "1", name: "hej", imgUrl: "none" },
      // { id: "2", name: "no", imgUrl: "none" },
      // { id: "3", name: "ye", imgUrl: "none" },
    ],
  },
  {
    id: "tier-2",
    name: "tierB",
    items: [
      // { id: "4", name: "tet", imgUrl: "none" },
      // { id: "5", name: "o", imgUrl: "none" },
      // { id: "6", name: "mik", imgUrl: "none" },
    ],
  },
  {
    id: "tier-3",
    name: "tierC",
    items: [
      // { id: "7", name: "213", imgUrl: "none" },
      // { id: "8", name: "5523", imgUrl: "none" },
      // { id: "9", name: "67", imgUrl: "none" },
    ],
  },
  {
    id: "no-tier",
    name: "tierless",
    items: [],
  },
];

export const useTierStore = create<TierStore>()(
  persist(
    (set, get) => ({
      tiersData: initialData,

      setTiers: (tiers) => set({ tiersData: tiers }),

      findContainer: (itemId) => {
        const tiers = get().tiersData;
        return tiers.find(
          (tier) =>
            tier.items.find((item) => item.id === itemId) || tier.id === itemId
        );
      },

      sortItem: (tierId, activeId, overId) => {
        set((state) => ({
          tiersData: state.tiersData.map((tier) => {
            if (tier.id !== tierId) return tier;

            const items = [...tier.items];

            const oldIndex = items.findIndex((i) => i.id === activeId);
            const newIndex = items.findIndex((i) => i.id === overId);

            const newItems = arrayMove(items, oldIndex, newIndex);

            return {
              ...tier,
              items: newItems,
            };
          }),
        }));
      },

      moveItem: (fromTierId, toTierId, activeId, overId) => {
        set((state) => {
          const movedItem = state.tiersData
            .find((i) => i.id === fromTierId)
            ?.items.find((i) => i.id === activeId);
          if (!movedItem) return { tiersData: state.tiersData };
          return {
            tiersData: state.tiersData.map((tier) => {
              if (tier.id === fromTierId) {
                const items = tier.items.filter((i) => i.id !== activeId);
                return { ...tier, items };
              }

              if (tier.id === toTierId) {
                const items = [...tier.items];
                const index = items.findIndex((i) => i.id === overId);

                if (index === -1) {
                  items.push(movedItem);
                } else {
                  items.splice(index, 0, movedItem);
                }

                return { ...tier, items };
              }
              return tier;
            }),
          };
        });
      },
      addItem: (tierId, item) => {
        set((state) => ({
          tiersData: state.tiersData.map((tier) =>
            tier.id === tierId
              ? { ...tier, items: [...tier.items, item] }
              : tier
          ),
        }));
      },
    }),

    { name: "tierlist-storage" }
  )
);
