export type LeaderCategory = 'goal' | 'assist' | 'saves';

// A single player record
export interface SeasonLeaderPlayer {
  id: number;
  firstName: string;
  lastName: string;
  name: string;         // full name for display if needed
  team: string;
  image: string;
  goals?: number;
  assists?: number;
  saves?: number;
}

// The full response for a category
export interface SeasonLeaderCategoryData {
  category: LeaderCategory;
  topPlayer: SeasonLeaderPlayer | null;
  players: SeasonLeaderPlayer[];
}