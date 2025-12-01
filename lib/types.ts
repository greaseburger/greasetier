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
