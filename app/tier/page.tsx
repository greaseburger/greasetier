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

import { Tier } from "./Tier";
type Tiers = Record<string, string[]>;

export default function App() {
  const [tiers, setTiers] = useState<Tiers>({
    tierA: ["a1", "a2", "a3"],
    tierB: ["b1", "b2"],
    tierC: [],
  });

  const [activeId, setActiveId] = useState<string | null>(null);

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
    const keys = Object.keys(tiers);
    return keys.find((key) => tiers[key].includes(id) || key === id);
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
        {Object.entries(tiers).map(([id]) => (
          <Tier key={id} id={id} items={tiers[id]} />
        ))}
        <DragOverlay>
          {activeId ? (
            <Item className=" p-5 bg-orange-700 opacity-70" id={activeId} />
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
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const fromTier = findContainer(activeId);
    const toTier = findContainer(overId);
    console.log(toTier);

    if (!fromTier || !toTier) return;
    if (fromTier === toTier) return;

    setTiers((prev) => {
      const newTiers = { ...prev };

      const fromItems = [...newTiers[fromTier]];
      const toItems = [...newTiers[toTier]];

      //remove from og tier
      fromItems.splice(fromItems.indexOf(activeId), 1);
      //add to new tier
      const overIndex = toItems.indexOf(overId);

      if (overIndex === -1) {
        //dropped to empty tier
        toItems.push(activeId);
      } else {
        toItems.splice(overIndex, 0, activeId);
      }

      newTiers[fromTier] = fromItems;
      newTiers[toTier] = toItems;

      return newTiers;
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const fromTier = findContainer(activeId);
    const toTier = findContainer(overId);

    if (!fromTier || !toTier) return;
    if (fromTier !== toTier) return;

    setTiers((prev) => {
      const newTiers = { ...prev };
      const items = [...newTiers[fromTier]];

      const oldIndex = items.indexOf(activeId);
      const newIndex = items.indexOf(overId);

      newTiers[fromTier] = arrayMove(items, oldIndex, newIndex);

      return newTiers;
    });

    setActiveId(null);
  }
}
