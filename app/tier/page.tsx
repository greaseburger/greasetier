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
  const searchManga = useMangaStore((state) => state.searchManga);
  const addItem = useTierStore((state) => state.addItem);

  const [value, setValue] = useState("berserk");
  const debounced = useDebounce(value, 400);

  useEffect(() => {
    if (debounced.trim().length > 2) {
      searchManga(debounced);
    }
  }, [debounced, searchManga]);

  const handleAdd = (itemData: JikanManga, tierId: string) => {
    const item: TierItem = {
      id: itemData.mal_id.toString(),
      name: itemData.title,
      imgUrl: itemData.images.jpg.image_url,
    };
    addItem(tierId, item);
  };

  return (
    <div className="m-10">
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
                alt={result.title + " cover"}
                width={100}
                height={100}
              />
              <p>{result.title}</p>
              <button
                onClick={() => handleAdd(result, "no-tier")}
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
