export interface Fixture {
    id: number;
    matchDay: number;
    matchDayId: number;
    homeTeamLogo: string;
    homeTeamName: string;
    homeTeamShortName: string;
    awayTeamLogo: string;
    awayTeamName: string;
    awayTeamShortName: string;
    homeTeamScore: number | null;
    awayTeamScore: number | null;
    competition: string;    // "Premier League 2024"
    status: 'pending' | 'live' | 'completed';
    date: Date;
    roundNumber: number;
  }