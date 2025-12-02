"use client";

import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { SortableItem } from "./SortableItem";
import { useDroppable } from "@dnd-kit/core";
import { Tier } from "@/lib/types";
import { useTierStore } from "@/store/useTierStore";

export const TierRow = ({
  tier: tier,
  className,
}: {
  tier: Tier;
  className?: string;
}) => {
  const { setNodeRef: setNodeRefDrop } = useDroppable({
    id: tier.id,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setNodeRefSort,
    transform,
    transition,
  } = useSortable({ id: tier.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const updateTier = useTierStore((state) => state.updateTier);

  return (
    <SortableContext
      items={tier.items.map((item) => item.id)}
      strategy={horizontalListSortingStrategy}
    >
      <div
        ref={(node) => {
          setNodeRefDrop(node);
          setNodeRefSort(node);
        }}
        style={style}
        className={
          "flex flex-row border border-white  w-full h-32 " + className
        }
      >
        {tier.name !== "tierless" ? (
          <input
            type="text"
            value={tier.name}
            onChange={(e) => updateTier(tier.id, e.target.value)}
            placeholder="tier name..."
            className="bg-green-500 p-2 w-32 text-xl text-center"
          />
        ) : null}
        {tier.items.map((item) => (
          <SortableItem key={item.id} item={item} />
        ))}

        {tier.name !== "tierless" ? (
          <div
            {...attributes}
            {...listeners}
            className="p-5 h-full bg-yellow-500 ml-auto text-3xl flex flex-col items-center justify-center cursor-grab"
          >
            <span className="pointer-events-none">=</span>
          </div>
        ) : null}
      </div>
    </SortableContext>
  );
};
