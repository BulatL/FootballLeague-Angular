
export interface PlayoffBracket {
  id: number;
  name: string;
  seasonId: number;
  numberOfTeams: number;
  startDate: string;
  isFinished: boolean;
  championTeamId?: number;
  championTeamName?: string;
  seeds: PlayoffSeed[];
  fixtures: PlayoffFixture[];
}

export interface PlayoffSeed {
  id: number;
  teamId: number;
  teamName: string;
  teamShortName: string;
  teamLogo?: string;
  seedNumber: number;
  regularSeasonPosition: number;
}

export interface PlayoffFixture {
  id: number;
  bracketPosition: number;
  fixtureId?: number;
  isFinished: boolean;
  
  // Home Team
  homeTeamSeedId?: number;
  homeTeamSeedNumber?: number;
  homeTeamId?: number;
  homeTeamName?: string;
  homeTeamShortName?: string;
  homeTeamLogo?: string;
  
  // Away Team
  awayTeamSeedId?: number;
  awayTeamSeedNumber?: number;
  awayTeamId?: number;
  awayTeamName?: string;
  awayTeamShortName?: string;
  awayTeamLogo?: string;
  
  // Fixture Details
  fixtureDateTime?: string;
  homeScore?: number;
  awayScore?: number;
  
  // Winner
  winnerTeamId?: number;
  winnerTeamName?: string;
  
  // Round Info
  roundName: string;
  roundNumber: number;
}