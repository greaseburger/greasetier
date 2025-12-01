"use client";

import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

import { SortableItem } from "./SortableItem";
import { useDroppable } from "@dnd-kit/core";
import { Tier } from "@/lib/types";

export const TierRow = ({ tier: tier }: { tier: Tier }) => {
  const { setNodeRef } = useDroppable({
    id: tier.id,
  });

  return (
    <SortableContext
      items={tier.items}
      strategy={horizontalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className="flex flex-row border border-white h-20 w-full"
      >
        {tier.items.map((item) => (
          <SortableItem key={item.id} item={item} />
        ))}
      </div>
    </SortableContext>
  );
};
