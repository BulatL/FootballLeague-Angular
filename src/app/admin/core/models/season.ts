export interface Season {
  id: number;
  name: string;
  year: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  leagueId: number;
  leagueName?: string;
}