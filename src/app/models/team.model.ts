export interface Team {
  id: number;
  name: string;
  leagueId: number;
  joinedDate: Date;
  activeSeasonId: number;
  insertedBy: string;
  insertedOn: Date;
  modifiedBy?: string;
  modifiedOn?: Date;
}