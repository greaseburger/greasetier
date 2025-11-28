"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Item } from "./Item";

export const SortableItem = (props: { id: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  //   const style = {
  //     transform:
  //       typeof window !== "undefined"
  //         ? CSS.Transform.toString(transform)
  //         : undefined,
  //     transition: typeof window !== "undefined" ? transition : undefined,
  //   };

  //   const style = {
  //     transform: transform
  //       ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
  //       : undefined,
  //     transition: transition || undefined, // set to undefined to prevent flicker
  //   };

  return (
    <Item
      ref={setNodeRef}
      id={props.id}
      style={style}
      {...attributes}
      {...listeners}
      className="m-2 p-5 bg-orange-500"
    />
  );
};
