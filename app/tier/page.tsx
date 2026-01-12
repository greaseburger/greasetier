"use client";

import { Tierlist } from "@/components/Tierlist";
import { useMangaStore } from "@/store/useMangaStore";
import { useTierStore } from "@/store/useTierStore";
import { JikanManga, TierItem } from "@/lib/types";
import { useEffect, useState } from "react";
import Image from "next/image";

const useDebounce = (value: string, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debounced;
};

export default function App() {
  const results = useMangaStore((state) => state.results);
  const itemIds = useTierStore((state) => state.itemIds);

  const { searchManga } = useMangaStore.getState();
  const { addItem } = useTierStore.getState();

  const [value, setValue] = useState("berserk");
  const debounced = useDebounce(value, 400);

  useEffect(() => {
    if (debounced.trim().length > 2) {
      searchManga(debounced);
    }
  }, [debounced, searchManga]);

  const handleAdd = (itemData: JikanManga, tierId: string) => {
    const title = itemData.title_english
      ? itemData.title_english
      : itemData.title;
    const item: TierItem = {
      id: "item-" + itemData.mal_id.toString(),
      name: title,
      imgUrl: itemData.images.jpg.image_url,
    };
    if (!itemIds.includes(item.id)) addItem(tierId, item);
  };

  return (
    <div className="flex flex-row">
      <Tierlist />
      <div className="flex h-dvh w-1/4 flex-col gap-2 overflow-y-scroll p-4">
        <h2>Add items to the tierlist</h2>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search manga..."
          className="mb-2 w-full rounded-sm border p-1 focus:outline-none"
        />
        <div className="flex flex-row flex-wrap gap-3">
          {results.map((result) => (
            <div key={result.mal_id} className="">
              <div
                onClick={() => handleAdd(result, "tierless")}
                className="group relative size-fit cursor-pointer"
              >
                <div className="absolute size-full content-center bg-green-500/40 text-center text-6xl opacity-0 hover:opacity-100">
                  +
                </div>
                <Image
                  src={result.images.jpg.image_url}
                  alt={result.title_english + " cover"}
                  width={100}
                  height={100}
                  className="h-28 w-20 rounded-sm object-cover"
                />
                <div className="absolute top-full left-0 z-50 mt-1 hidden w-fit rounded bg-white p-0.5 text-black shadow-lg group-hover:block">
                  {result.title_english ? result.title_english : result.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
