export interface FavoriteIdea {
  idea: string;
  name?: string;
  timestamp?: number;
}

export type Theme = "system" | "light" | "dark";
export type SortOption = "default" | "az" | "za" | "oldest";

export interface Locks {
  genre: boolean;
  mechanic: boolean;
  twist: boolean;
  tone: boolean;
  perspective: boolean;
  role: boolean;
}
