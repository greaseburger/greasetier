export type Tiers = Tier[];

export interface Tier {
  id: string;
  name: string;
  items: TierItem[];
}
export interface TierItem {
  id: string;
  name: string;
  imgUrl: string;
}

export interface JikanMangaImage {
  jpg: {
    image_url: string;
  };
}

export interface JikanManga {
  mal_id: number;
  title: string;
  title_english: string;
  images: JikanMangaImage;
}

export type JikanResponse = JikanManga[];
