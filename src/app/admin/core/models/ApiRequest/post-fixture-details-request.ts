export interface PostFixtureRequestModel {
  fixtureId: number;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number;
  awayScore: number;
  homeSaves: number;
  awaySaves: number;
  HomeShootsOnTarget: number;
  AwayShootsOnTarget: number;
  HomeTotalShoots: number;
  AwayTotalShoots: number;
  savesByHomeTeam: number;
  savesByAwayTeam: number;
  homeTeamCorners: number;
  awayTeamCorners: number;
  homeTeamFouls: number;
  awayTeamFouls: number;


  playerStatistics: PostFixturePlayerStatisticRequest[];
  goals: PostFixtureGoalRequest[];
  playerCards: PostFixtureCardRequest[];
}

export interface PostFixturePlayerStatisticRequest {
  playerTeamId: number;
  position: string;
  isPlaying: boolean;
  saves: number;
  teamId: number;
}

export interface PostFixtureGoalRequest {
  playerTeamId: number;
  minuteScored: number,
  goalType: string,
  AssistPlayerTeamId?: number;
}

export interface PostFixtureCardRequest {
  playerTeamId: number;
  cardType: string,
  minuteGiven: number,
}