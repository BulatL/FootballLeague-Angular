export interface Fixture {
    id: number;
    matchDay: number;
    matchDayId: number;
    homeTeamId: number | null;
    homeTeamLogo: string;
    homeTeamName: string;
    homeTeamShortName: string;
    awayTeamId: number | null;
    awayTeamLogo: string;
    awayTeamName: string;
    awayTeamShortName: string;
    homeTeamScore: number | null;
    awayTeamScore: number | null;
    competition: string;    // "Premier League 2024"
    status: 'pending' | 'live' | 'completed';
    date: Date;
    roundNumber: number;
    homeShootsOnTarget: number;
    awayShootsOnTarget: number;
    homeTotalShoots: number;
    awayTotalShoots: number;
    savesByHomeTeam: number;
    savesByAwayTeam: number;
    homeTeamCorners: number;
    awayTeamCorners: number;
    homeTeamFouls: number;
    awayTeamFouls: number;
  }