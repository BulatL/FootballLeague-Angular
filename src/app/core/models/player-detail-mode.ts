export interface PlayerDetailModel {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  totalGames: number;
  totalWins: number;
  totalGoals: number;
  totalAssists: number;
  totalSaves: number;
  totalThropies: number;
  position: string;
  currentSeasonStats: CurrentSeasonStats;
  playerAwards: { $values: Award[]};
}

export interface CurrentSeasonStats {
  games: number;
  wins: number;
  losses: number;
  draws: number;
  penalties: number;
  penaltiesMissed: number;
  dreamTeamPoint: number;
  thropies: number;
  goalsScored: number;
  assists: number;
  saves?: number | null; // Optional since it's nullable in C#
  yellowCards: number;
  redCards: number;
}

export interface Award {
  image: string;
  seasonName: string;
  awardName: string;
  fixtureId?: number | null;
}