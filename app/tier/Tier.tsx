"use client";

import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

import { SortableItem } from "./SortableItem";
import { useDroppable } from "@dnd-kit/core";

export const Tier = ({ id, items }: { id: string; items: string[] }) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <SortableContext items={items} strategy={horizontalListSortingStrategy}>
      <div
        ref={setNodeRef}
        className="flex flex-row border border-white h-20 w-full"
      >
        {items.map((itemId) => (
          <SortableItem key={itemId} id={itemId} />
        ))}
      </div>
    </SortableContext>
  );
};
