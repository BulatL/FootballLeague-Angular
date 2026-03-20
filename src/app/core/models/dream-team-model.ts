export interface DreamTeamModel {
  goalkeeper: Player | null;
  player1: Player | null;
  player2: Player | null;
  player3: Player | null;
  player4: Player | null;
  totalPoints: number;
  avgPoints: number;
  playedGames: number;
  totalGoals: number;
  isCurrentSeason: boolean;
}

export interface Player {
  playerId: number;
  firstName: string;
  lastName: string;
  image: string;
  dreamTeamPoints: number;
}
