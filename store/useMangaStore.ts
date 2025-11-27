import { create } from "zustand";

export const useMangaStore = create((set) => ({
  results: [],
  loading: false,

  searchManga: async (query: string) => {
    set({ loading: true });
    const res = await fetch("https://api.jikan.moe/v4/manga?q=" + query);
    const data = await res.json();
    set({ results: data.results, loading: false });
  },
}));
