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
        className={`flex flex-row border border-white w-full min-h-32 ${className} ${
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
            className={`${className} w-32 group relative flex justify-center rounded-tr-none bg-green-500 rounded-br-none mt-0`}
          >
            <button
              onClick={addTier}
              className="text-4xl cursor-pointer size-full"
            >
              +
            </button>
            <div className="absolute left-0 -top-1 mt-1 opacity-0 w-fit p-0.5 bg-white text-black rounded shadow-lg group-hover:opacity-100 transition-opacity duration-200">
              Add a tier
            </div>
          </div>
        )}
        <div
          ref={setNodeRefDrop}
          className="w-full flex flex-row items-center flex-wrap "
        >
          {tier.items.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </div>
        {tier.id !== "tierless" ? (
          <div
            {...attributes}
            {...listeners}
            className={`p-6 min-h-32 bg-yellow-500 w-1 ml-auto text-3xl flex flex-col items-center justify-center cursor-grab rounded-tl-none rounded-bl-none ${className}`}
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
