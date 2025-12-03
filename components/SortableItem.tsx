"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { TierCard } from "./TierCard";
import { TierItem } from "@/lib/types";

export const SortableItem = ({ item: item }: { item: TierItem }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: `${transition ?? "transform 200ms ease"}`,
  };

  return (
    <TierCard
      ref={setNodeRef}
      item={item}
      style={style}
      {...attributes}
      {...listeners}
      className="p-1"
    />
  );
};
