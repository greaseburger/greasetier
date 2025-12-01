import { JikanResponse } from "@/lib/types";
import { create } from "zustand";

interface MangaStore {
  results: JikanResponse;
  loading: boolean;
  searchManga: (query: string) => void;
}

export const useMangaStore = create<MangaStore>((set) => ({
  results: [],
  loading: false,

  searchManga: async (query: string) => {
    set({ loading: true });
    const res = await fetch(
      `https://api.jikan.moe/v4/manga?q=${query}&sfw=true&limit=10&order_by=popularity`
    );
    const data = await res.json();
    set({ results: data.data ?? [], loading: false });
  },
}));
