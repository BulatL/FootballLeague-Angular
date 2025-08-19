export class FixtureFormModel {
  id: number;
  homeTeamId: number;
  homeTeamName: string;
  homeTeamLogo: string;
  homeScore: number;
  awayTeamId: number;
  awayTeamName: string;
  awayTeamLogo: string;
  awayScore: number;
  fixtureDateTime: Date;

  constructor(
    id: number = 0,
    homeTeamId: number = 0,
    homeTeamName: string = '',
    homeTeamLogo: string = '',
    homeScore: number = 0,
    awayTeamId: number = 0,
    awayTeamName: string = '',
    awayTeamLogo: string = '',
    awayScore: number = 0,
    fixtureDateTime: Date,
  ) {
    this.id = id;
    this.homeTeamId = homeTeamId
    this.homeTeamName = homeTeamName;
    this.homeTeamLogo = homeTeamLogo;
    this.homeScore = homeScore;
    this.awayTeamId = awayTeamId
    this.awayTeamName = awayTeamName;
    this.awayTeamLogo = awayTeamLogo;
    this.awayScore = awayScore;
    this.fixtureDateTime = fixtureDateTime
  }
}