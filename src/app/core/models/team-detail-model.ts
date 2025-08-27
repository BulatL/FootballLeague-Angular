export interface TeamDetailModel {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  totalGoalsScored: number;
  totalGoalsConceded: number;
  totalThropies: number;
  currentSeasonStats: CurrentSeasonStats;
  teamAwards: { $values: Award[]};
  fixtures: TeamDetailFixture[];
  lineup: TeamLineup[];
}

export interface CurrentSeasonStats {
  games: number;
  wins: number;
  losses: number;
  draws: number;
  cleanSheets: number;
  goalsScored: number;
  goalsConceded: number;
  penalties: number;
  penaltiesMissed: number;
  dreamTeamPoint: number;
}

export interface Award {
  image: string;
  seasonName: string;
  awardName: string;
  fixtureId?: number | null;
}

export interface TeamDetailFixture {
  roundNumber: string;
  fixtureId: number;
  homeTeamId: number;
  homeTeamShortName: string;
  homeTeamLogo: string;
  homeTeamScore: number;
  awayTeamId: number;
  awayTeamShortName: string;
  awayTeamLogo: string;
  awayTeamScore: number;
  fixtureDate: Date;
}


export interface TeamLineup {
  playerId: number;
  name: string;
  image: string;
  position: string;
  gamesPlayed: number;
  goalsScored: number;
  goalsConceded: number;
  assists: number;
  saves?: number | null;
  dreamTeamPoints: number;
}