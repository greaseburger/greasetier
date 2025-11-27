"use client";

import { useTierStore } from "@/store/useTierStore";
import { useState } from "react";

export default function Home() {
  const tiers = useTierStore((state) => state.tiers);
  const addToTier = useTierStore((state) => state.addToTier);
  const removeFromTier = useTierStore((state) => state.removeFromTier);
  const moveItem = useTierStore((state) => state.moveItem);

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

  return (
    <>
      <div>
        <h1>greasetier</h1>
      </div>

      <h1>IS MOVING: {isMoving.toString()}</h1>

      {tiers.map((tier) => (
        <div
          onClick={() => handleMoveTo(tier.name)}
          key={tier.name}
          className="m-4 p-2 bg-blue-500 flex flex-row"
        >
          <h2 className="text-xl font-bold p-5 bg-yellow-500">{tier.name}</h2>
          <ul className=" bg-green-500 flex flex-row">
            {tier.items.map((item) => (
              <li
                key={item}
                className="border-black border p-5 text-lg cursor-pointer hover:bg-orange-500"
                onClick={() => moveItemHandler(tier.name, item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}

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
