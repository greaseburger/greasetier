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
    <div className="m-10 mx-44">
      <Tierlist />
      <div>
        <h2>Results</h2>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search manga..."
          className="border p-1 mb-2"
        />
        <div className="flex flex-col">
          {results.map((result) => (
            <div key={result.mal_id} className="flex gap-2 flex-col w-100">
              <Image
                src={result.images.jpg.image_url}
                alt={result.title_english + " cover"}
                width={100}
                height={100}
              />
              <p>
                {result.title_english ? result.title_english : result.title}
              </p>
              <button
                onClick={() => handleAdd(result, "tierless")}
                className="cursor-pointer"
              >
                Add To Tierlist
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
