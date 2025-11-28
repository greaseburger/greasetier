"use client";

import { useTierStore } from "@/store/useTierStore";
import { useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export default function Home() {
  const tiers = useTierStore((state) => state.tiers);
  const addToTier = useTierStore((state) => state.addToTier);
  const removeFromTier = useTierStore((state) => state.removeFromTier);
  const moveItem = useTierStore((state) => state.moveItem);
  const addTier = useTierStore((state) => state.addTier);
  const removeTier = useTierStore((state) => state.removeTier);

  const add = (formData: FormData) => {
    const tierName = formData.get("tierName") as string;
    const item = formData.get("item") as string;

    console.log("Adding item:", item, "to tier:", tierName);
    if (item && tierName) {
      addToTier(tierName, item);
    }
  };

  const remove = (formData: FormData) => {
    const tierName = formData.get("tierName") as string;
    const item = formData.get("item") as string;

    console.log("Removing item:", item, "from tier:", tierName);
    if (item && tierName) {
      removeFromTier(tierName, item);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    if (!e.over) return;
    const item = e.active.id as string;
    const newTier = e.over.id as string;
    const oldTier = e.active.data.current?.fromTier;

    if (oldTier !== newTier) moveItem(oldTier, newTier, item);
  };

  const handleAddTier = (formData: FormData) => {
    const tierName = formData.get("tierName") as string;
    if (tierName) {
      addTier(tierName);
    }
  };

  const TierItem = ({
    tierName,
    item,
    id,
  }: {
    tierName: string;
    item: string;
    id: string;
  }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: id,
      data: {
        fromTier: tierName,
      },
    });
    const style = {
      transform: CSS.Translate.toString(transform),
    };

    return (
      <li
        className="bg-green-500 border-black border p-5 text-lg cursor-pointer hover:bg-orange-500"
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
      >
        {item}
      </li>
    );
  };

  const TierRow = (props: {
    tierName: string;
    children: React.ReactNode;
    id: string;
  }) => {
    const { setNodeRef } = useDroppable({
      id: props.id,
    });

    const className =
      props.id === "noTier"
        ? "m-4 p-2 bg-black flex flex-row"
        : "m-4 p-2 bg-blue-500 flex flex-row";

    const header =
      props.id === "noTier" ? null : (
        <h2 className="text-xl font-bold p-5 bg-yellow-500">
          {props.tierName}
        </h2>
      );

    return (
      <div className={className} ref={setNodeRef}>
        {header}
        <ul className="flex flex-row w-full">{props.children}</ul>
      </div>
    );
  };

  const tierItems = ["1", "2", "3", "4", "5"];

  return (
    <>
      <div>
        <h1>greasetier</h1>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        {tiers.map((tier) => (
          <TierRow key={tier.name} tierName={tier.name} id={tier.name}>
            {tier.items.map((item) => (
              <TierItem key={item} tierName={tier.name} item={item} id={item} />
            ))}
            <li
              className="bg-red-500 border-black border p-5 text-lg cursor-pointer hover:bg-orange-500 ml-auto"
              onClick={() => removeTier(tier.name)}
            >
              -
            </li>
          </TierRow>
        ))}

        <div className="m-4 p-2 bg-blue-700 flex flex-row">
          <form action={handleAddTier} className="flex flex-row gap-2">
            <button
              type="submit"
              className="text-xl font-bold p-5 bg-yellow-700 hover:bg-orange-700 cursor-pointer"
            >
              +
            </button>
            <input
              type="text"
              name="tierName"
              id="tierName"
              className="bg-green-700 h-full text-xl p-1"
            />
          </form>
        </div>
        <TierRow tierName="noTier" id="noTier">
          {tierItems.map((item) => (
            <TierItem key={item} tierName="noTier" item={item} id={item} />
          ))}
        </TierRow>
      </DndContext>

      <form action={add} className="m-4">
        <input type="text" name="item" placeholder="Item Name" />
        <select name="tierName">
          {tiers.map((tier) => (
            <option key={tier.name} value={tier.name}>
              {tier.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Item to Tier</button>
      </form>

      <form action={remove}>
        <input type="text" name="item" placeholder="Item Name to Remove" />
        <select name="tierName">
          {tiers.map((tier) => (
            <option key={tier.name} value={tier.name}>
              {tier.name}
            </option>
          ))}
        </select>
        <button type="submit">Remove Item from Tier</button>
      </form>
    </>
  );
}
