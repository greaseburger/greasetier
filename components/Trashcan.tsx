"use client";

import { SortableItem } from "./SortableItem";
import { useDroppable } from "@dnd-kit/core";

import { useTierStore } from "@/store/useTierStore";

export const Trashcan = () => {
  const { setNodeRef: setNodeRefDrop } = useDroppable({
    id: "trashcan",
  });

  return (
    <div
      ref={(node) => {
        setNodeRefDrop(node);
      }}
      className="flex flex-row border border-white bg-red-500 opacity-30 w-full h-32"
    >
      DELETE ITEM
    </div>
  );
};
