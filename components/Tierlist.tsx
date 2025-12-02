"use client";
import { useEffect, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  rectIntersection,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { TierCard } from "./TierCard";

import { TierRow } from "./TierRow";

import { useTierStore } from "@/store/useTierStore";

export const Tierlist = () => {
  const tiers = useTierStore((state) => state.tiersData);
  const sortItem = useTierStore.getState().sortItem;
  const moveItem = useTierStore.getState().moveItem;
  const sortTiers = useTierStore.getState().sortTiers;
  const findContainer = useTierStore.getState().findContainer;

  useEffect(() => {
    console.log("tiers was changed");
  }, [tiers]);

  const [activeId, setActiveId] = useState<string | null>(null);

  const activeItem =
    tiers.flatMap((tier) => tier.items).find((i) => i.id === activeId) || null;

  const activeTier = tiers.find((tier) => tier.id === activeId) || null;

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

  const Overlay = () => {
    if (activeItem) {
      return <TierCard className="opacity-70" item={activeItem} />;
    }
    if (activeTier) {
      return <TierRow tier={activeTier} className="opacity-70" />;
    }
    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div className="flex flex-col gap-3">
        <SortableContext
          items={tiers.filter((t) => t.id !== "tierless").map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tiers.map((tier) => (
            <TierRow key={tier.id} tier={tier} />
          ))}
        </SortableContext>
        <DragOverlay>
          <Overlay />
        </DragOverlay>
      </div>
    </DndContext>
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
  }

  function isTier(id: string) {
    return id.startsWith("tier-");
  }
  function isItem(id: string) {
    return id.startsWith("item-");
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (isTier(activeId) && isTier(overId)) {
      sortTiers(activeId, overId);
      return;
    }

    if (isItem(activeId)) {
      const fromTier = findContainer(activeId);
      const toTier = findContainer(overId);

      if (!fromTier || !toTier) return;

      // same tier
      if (fromTier === toTier) {
        sortItem(fromTier.id, activeId, overId);
        // new tier
      } else if (fromTier !== toTier) {
        moveItem(fromTier.id, toTier.id, activeId, overId);
      }
    }
    setActiveId(null);
  }
};
