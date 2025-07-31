export interface Team {
  id: number;
  name: string;
  logo: string;
  city: string;
  foundedYear: number;
  isActive: boolean;
  leagueId: number;
  leagueName?: string;
  description?: string;
}
