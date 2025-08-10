// export interface Team {
//   id: number;
//   name: string;
//   logo: string;
//   city: string;
//   foundedYear: number;
//   isActive: boolean;
//   leagueId: number;
//   leagueName?: string;
//   description?: string;
// }

export interface Team {
  id: number;
  fullName: string;
  shortName: string;
  logo: string;
  joinedDate: string;
  leagueId: number;
  leagueName?: string;
  seasonId: number;
  seasonName?: string;
}
