"use client";

import { useTierStore } from "@/store/useTierStore";
import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";

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

  const [isMoving, setisMoving] = useState(false);
  const [oldTier, setOldTier] = useState<string | null>(null);
  const [movingItem, setMovingItem] = useState<string | null>(null);

  const moveItemHandler = (oldTier: string, item: string) => {
    setisMoving(true);
    setOldTier(oldTier);
    setMovingItem(item);
  };

  const handleMoveTo = (newTier: string) => {
    if (isMoving) {
      setisMoving(false);
      if (oldTier && movingItem && oldTier !== newTier) {
        moveItem(oldTier, newTier, movingItem);
      }
    }
  };

  const handleAddTier = (formData: FormData) => {
    const tierName = formData.get("tierName") as string;
    if (tierName) {
      addTier(tierName);
    }
  };

  const TierItem = ({ tierName, item }: { tierName: string; item: string }) => {
    return (
      <li
        className="bg-green-500 border-black border p-5 text-lg cursor-pointer hover:bg-orange-500"
        onClick={() => moveItemHandler(tierName, item)}
      >
        {item}
      </li>
    );
  };

  const TierRow = (props: { tierName: string; children: React.ReactNode }) => {
    return (
      <div
        onClick={() => handleMoveTo(props.tierName)}
        className="m-4 p-2 bg-blue-500 flex flex-row"
      >
        <h2 className="text-xl font-bold p-5 bg-yellow-500">
          {props.tierName}
        </h2>
        <ul className="flex flex-row w-full">{props.children}</ul>
      </div>
    );
  };

  return (
    <>
      <div>
        <h1>greasetier</h1>
      </div>

      <h1>IS MOVING: {isMoving.toString()}</h1>

      {tiers.map((tier) => (
        <TierRow key={tier.name} tierName={tier.name}>
          {tier.items.map((item) => (
            <TierItem key={item} tierName={tier.name} item={item} />
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
