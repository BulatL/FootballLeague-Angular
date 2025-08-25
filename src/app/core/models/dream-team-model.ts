export interface DreamTeamModel {
  goalkeeper: Player;
  player1: Player;
  player2: Player;
  player3: Player;
  player4: Player;
  totalPoints: number;
  avgPoints: number;
  playedGames: number;
  totalGoals: number;
}

export interface Player {
  playerId: number;
  firstName: string;
  lastName: string;
  image: string;
  dreamTeamPoints: number;
}
