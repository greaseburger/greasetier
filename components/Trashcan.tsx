"use client";

import { useDroppable } from "@dnd-kit/core";

export const Trashcan = ({ active }: { active: string | null }) => {
  const { setNodeRef: setNodeRefDrop } = useDroppable({
    id: "trashcan",
  });

  return (
    <div
      ref={(node) => {
        setNodeRefDrop(node);
      }}
      className={`mt-5 h-32 w-full content-center rounded-lg border border-white bg-red-500/50 text-center text-2xl transition-opacity duration-200 ${active ? "opacity-100" : "opacity-50"}`}
    >
      Trash
    </div>
  );
};
