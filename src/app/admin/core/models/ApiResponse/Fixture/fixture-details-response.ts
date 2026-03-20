export interface FixtureDetailsResponse {
  goals: FixtureDetailGoal[];
  cards: FixtureDetailCard[];
  playerStatistics: FixtureDetailPlayerStat[];
  statistics: FixtureDetailStatistics;
}

export interface FixtureDetailGoal {
  team: string;
  teamId: number;
  playerTeamId: number;
  assistPlayerTeamId: number | null;
  type: string;
  minuteScored: number;
}

export interface FixtureDetailCard {
  team: string;
  playerTeamId: number;
  cardType: string;
  minuteGiven: number;
}

export interface FixtureDetailPlayerStat {
  playerTeamId: number;
  position: string;
  isPlaying: boolean;
  saves: number;
}

export interface FixtureDetailStatistics {
  homeShots: number;
  awayShots: number;
  homeShootsOnTarget: number;
  awayShootsOnTarget: number;
  homeSaves: number;
  awaySaves: number;
  homeCorners: number;
  awayCorners: number;
  homeFouls: number;
  awayFouls: number;
}
