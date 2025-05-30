export interface ApiResponse<T> {
  $id: string;
  $values: T[];
}

export interface Fixture {
    id: number;
    matchDay: number;
    homeTeamLogo: string;
    homeTeamName: string;
    awayTeamLogo: string;
    awayTeamName: string;
    homeTeamScore: number | null;
    awayTeamScore: number | null;
    competition: string;    // "Premier League 2024"
    status: 'pending' | 'live' | 'completed';
    date: Date;
  }