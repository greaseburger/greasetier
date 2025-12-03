import { create } from "zustand";
import { Tiers, Tier, TierItem } from "@/lib/types";
import { arrayMove } from "@dnd-kit/sortable";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

interface TierStore {
  tiersData: Tiers;
  itemIds: string[];
  nextColorIndex: number;
  setTiers: (tiers: Tiers) => void;
  findContainer: (id: string) => Tier | TierItem | undefined;
  sortTiers: (activeId: string, overId: string) => void;
  sortItem: (tierId: string, activeId: string, overId: string) => void;
  moveItem: (
    tierId: string,
    toTierId: string,
    activeId: string,
    overId: string
  ) => void;
  addItem: (tierId: string, item: TierItem) => void;
  removeItem: (itemId: string) => void;
  addTier: (tierName: string) => void;
  updateTier: (tierId: string, tierName: string) => void;
  updateTierColor: (tierId: string, color: string) => void;
  removeTier: (tierId: string) => void;
}

const initialData = [
  {
    id: "tier-1",
    name: "tierA",
    color: "#aabbcc",
    items: [],
  },
  {
    id: "tier-2",
    name: "tierB",
    color: "#aabbcc",
    items: [],
  },
  {
    id: "tier-3",
    name: "tierC",
    color: "#aabbcc",
    items: [],
  },
  {
    id: "tierless",
    name: "tierless",
    color: "#aabbcc",
    items: [],
  },
];

const presetColors = [
  "#9A3030",
  "#9A5030",
  "#9A8530",
  "#409A30",
  "#308F9A",
  "#30439A",
];

export const useTierStore = create<TierStore>()(
  persist(
    (set, get) => ({
      tiersData: initialData,
      itemIds: [],
      nextColorIndex: 0,

      setTiers: (tiers) => set({ tiersData: tiers }),

      findContainer: (itemId) => {
        const tiers = get().tiersData;
        return tiers.find(
          (tier) =>
            tier.items.find((item) => item.id === itemId) || tier.id === itemId
        );
      },
      sortTiers: (activeId, overId) => {
        set((state) => {
          const tiers = [...state.tiersData];
          const oldIndex = tiers.findIndex((i) => i.id === activeId);
          const newIndex = tiers.findIndex((i) => i.id === overId);
          const newTiers = arrayMove(tiers, oldIndex, newIndex);
          return { tiersData: newTiers };
        });
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
          tiersData: state.tiersData.map((tier) => {
            if (tier.id === tierId) {
              return { ...tier, items: [...tier.items, item] };
            } else {
              return tier;
            }
          }),
          itemIds: [...state.itemIds, item.id],
        }));
      },
      removeItem: (itemId) => {
        set((state) => ({
          tiersData: state.tiersData.map((tier) => ({
            ...tier,
            items: tier.items.filter((item) => item.id !== itemId),
          })),
          itemIds: state.itemIds.filter((id) => id !== itemId),
        }));
      },
      addTier: (tierName) => {
        const colorIndex = get().nextColorIndex;
        const newColorIndex =
          colorIndex + 1 >= presetColors.length ? 0 : colorIndex + 1;

        set((state) => {
          const newTiers = [...state.tiersData];
          newTiers.splice(newTiers.length - 1, 0, {
            id: "tier-" + uuidv4(),
            name: tierName,
            color: presetColors[colorIndex],
            items: [],
          });
          return { tiersData: newTiers, nextColorIndex: newColorIndex };
        });
      },
      updateTier: (tierId, tierName) => {
        set((state) => ({
          tiersData: state.tiersData.map((tier) => {
            if (tier.id === tierId) {
              return { ...tier, name: tierName };
            } else {
              return tier;
            }
          }),
        }));
      },
      updateTierColor: (tierId, color) => {
        set((state) => ({
          tiersData: state.tiersData.map((tier) => {
            if (tier.id === tierId) {
              return { ...tier, color: color };
            } else {
              return tier;
            }
          }),
        }));
      },
      removeTier: (tierId) => {
        set((state) => {
          const removedTier = state.tiersData.find(
            (tier) => tier.id === tierId
          );
          if (!removedTier) return state;

          return {
            tiersData: state.tiersData
              .filter((tier) => tier.id !== tierId)
              .map((tier) => {
                if (tier.id === "tierless") {
                  return {
                    ...tier,
                    items: [...tier.items, ...removedTier.items],
                  };
                }
                return tier;
              }),
          };
        });
      },
    }),

    { name: "tierlist-storage" }
  )
);
