"use client";

import {
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { SortableItem } from "./SortableItem";
import { useDroppable } from "@dnd-kit/core";
import { Tier } from "@/lib/types";
import { TierLabel } from "./TierLabel";

export const TierRow = ({
  tier: tier,
  className,
  addTier,
}: {
  tier: Tier;
  className?: string;
  addTier?: () => void;
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

  return (
    <SortableContext
      items={tier.items.map((item) => item.id)}
      strategy={rectSortingStrategy}
    >
      <div
        ref={(node) => {
          // setNodeRefDrop(node);
          setNodeRefSort(node);
        }}
        style={style}
        className={`flex min-h-32 w-full flex-row border border-white/20 ${className} ${
          tier.id === "tierless" && "mt-5"
        }`}
      >
        {tier.id !== "tierless" ? (
          <TierLabel
            id={tier.id}
            name={tier.name}
            color={tier.color}
            className={className}
          />
        ) : (
          <div
            className={`${className} group relative mt-0 flex w-32 justify-center rounded-tr-none rounded-br-none bg-green-500`}
          >
            <button
              onClick={addTier}
              className="size-full cursor-pointer text-4xl"
            >
              +
            </button>
            <div className="absolute -top-1 left-0 mt-1 w-fit rounded bg-white p-0.5 text-black opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              Add a tier
            </div>
          </div>
        )}
        <div
          ref={setNodeRefDrop}
          className="flex w-full flex-row flex-wrap items-center"
        >
          {tier.items.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </div>
        {tier.id !== "tierless" ? (
          <div
            {...attributes}
            {...listeners}
            className={`ml-auto flex min-h-32 w-1 cursor-grab flex-col items-center justify-center rounded-tl-none rounded-bl-none bg-white/10 p-6 text-3xl ${className}`}
          >
            <span className="pointer-events-none">=</span>
          </div>
        ) : (
          <div className="p-6"></div>
        )}
      </div>
    </SortableContext>
  );
};
