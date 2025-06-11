export interface ApiResponse<T> {
  $id: string;
  $values: T[];
}

export interface League {
    name: string;
    image: string;
    numberOfTeams: number;
    numberOfSeasons: number;
    numberOfPlayers: number;
  }