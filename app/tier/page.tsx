"use client";
import { useEffect, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  rectIntersection,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { Item } from "./Item";

import { TierRow } from "./Tier";

import { Tiers, Tier, TierItem } from "@/lib/types";

const tiersData: Tiers = [
  {
    id: "tier-1",
    name: "tierA",
    items: [
      { id: "1", name: "hej", imgUrl: "none" },
      { id: "2", name: "no", imgUrl: "none" },
      { id: "3", name: "ye", imgUrl: "none" },
    ],
  },
  {
    id: "tier-2",
    name: "tierB",
    items: [
      { id: "4", name: "tet", imgUrl: "none" },
      { id: "5", name: "o", imgUrl: "none" },
      { id: "6", name: "mik", imgUrl: "none" },
    ],
  },
  {
    id: "tier-3",
    name: "tierC",
    items: [
      { id: "7", name: "213", imgUrl: "none" },
      { id: "8", name: "5523", imgUrl: "none" },
      { id: "9", name: "67", imgUrl: "none" },
    ],
  },
];

export default function App() {
  const [tiers, setTiers] = useState<Tiers>(tiersData);

  useEffect(() => {
    console.log("tiers was changed");
  }, [tiers]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeItem =
    tiers.flatMap((tier) => tier.items).find((i) => i.id === activeId) || null;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <h1>Loading...</h1>;
  }

  const findContainer = (id: string) => {
    return tiers.find(
      (tier) => tier.items.find((item) => item.id === id) || tier.id === id
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
    >
      <div className="flex flex-col gap-3">
        {tiers.map((tier) => (
          <TierRow key={tier.id} tier={tier} />
        ))}
        <DragOverlay>
          {activeItem ? (
            <Item className=" p-5 bg-orange-700 opacity-70" item={activeItem} />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    // const { active, over } = event;
    // if (!over || active.id === over.id) return;
    // const activeId = active.id as string;
    // const overId = over.id as string;
    // const fromTier = findContainer(activeId);
    // const toTier = findContainer(overId);
    // if (!fromTier || !toTier) return;
    // if (fromTier === toTier) return;
    // setTiers((prev) => {
    //   const newTiers = { ...prev };
    //   const fromItems = [...newTiers[fromTier]];
    //   const toItems = [...newTiers[toTier]];
    //   //remove from og tier
    //   fromItems.splice(fromItems.indexOf(activeId), 1);
    //   //add to new tier
    //   const overIndex = toItems.indexOf(overId);
    //   if (overIndex === -1) {
    //     //dropped to empty tier
    //     toItems.push(activeId);
    //   } else {
    //     toItems.splice(overIndex, 0, activeId);
    //   }
    //   newTiers[fromTier] = fromItems;
    //   newTiers[toTier] = toItems;
    //   return newTiers;
    // });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    console.log(over);

    const activeId = active.id as string;
    const overId = over.id as string;

    const fromTier = findContainer(activeId);
    const toTier = findContainer(overId);
    console.log(toTier);

    if (!fromTier || !toTier) return;

    // same tier
    if (fromTier === toTier) {
      setTiers((prev) => {
        return prev.map((tier) => {
          if (tier.id !== fromTier.id) return tier;

          const items = [...tier.items];

          const oldIndex = items.findIndex((i) => i.id === activeId);
          const newIndex = items.findIndex((i) => i.id === overId);

          if (oldIndex === -1 || newIndex === -1) return tier;

          const newItems = arrayMove(items, oldIndex, newIndex);

          return {
            ...tier,
            items: newItems,
          };
        });
      });
      // new tier
    } else if (fromTier !== toTier) {
      setTiers((prev) => {
        const movedItem = fromTier.items.find((i) => i.id === activeId);
        if (!movedItem) return prev;

        return prev.map((tier) => {
          if (tier.id === fromTier.id) {
            const items = tier.items.filter((i) => i.id !== activeId);
            return { ...tier, items };
          }

          if (tier.id === toTier.id) {
            const items = [...tier.items];
            const overIndex = items.findIndex((i) => i.id === overId);

            if (overIndex === -1) {
              items.push(movedItem);
            } else {
              items.splice(overIndex, 0, movedItem);
            }

            return { ...tier, items };
          }
          return tier;
        });
      });
    }
    setActiveId(null);
  }
}
