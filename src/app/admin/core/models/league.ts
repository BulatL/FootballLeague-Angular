export interface League {
  id: number;
  name: string;
  image: string;
  isActive: boolean;
  insertedBy: string;
  insertedOn: Date;
  modifiedBy?: string;
  modifiedOn?: Date;
}