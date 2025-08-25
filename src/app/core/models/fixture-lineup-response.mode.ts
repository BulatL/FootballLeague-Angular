export interface GetFixtureLineupResponse {
  homeTeamLineup: { $values: PlayerLineup[] };
  awayTeamLineup: { $values: PlayerLineup[] };


}


export interface PlayerLineup {
  playerId: number;
  playerTeamId: number;
  playerName: string;
  playerImage: string;
  position: string;
  dreamPoints: number;
  dreamPointsBreakdown?: DreamPointsBreakdown;
}

export interface DreamPointsBreakdown {
  goals: BreakdownItem;
  assists: BreakdownItem;
  saves: BreakdownItem;
  cleanSheets: BreakdownItem;
  winBonus: BreakdownItem;
  yellowCards: BreakdownItem;
  redCards: BreakdownItem;
  basePoints: BreakdownItem;
  goalsConcededPenalty: number;  // For every 3 goals conceded: -1
  ownGoalsPenalty: number;       // Own goals: -1 each
  total: number;
}

export interface BreakdownItem {
  count: number;
  points: number;
}

// Optional: Mapper class for transforming API response
export class FixtureLineupMapper {
  static fromApi(apiResponse: any): GetFixtureLineupResponse {
    return {
      homeTeamLineup: apiResponse.homeTeamLineup?.map(this.mapPlayerLineup) || [],
      awayTeamLineup: apiResponse.awayTeamLineup?.map(this.mapPlayerLineup) || []
    };
  }

  private static mapPlayerLineup(player: any): PlayerLineup {
    return {
      playerId: player.playerId,
      playerTeamId: player.playerTeamId,
      playerName: player.playerName,
      playerImage: player.playerImage,
      position: player.position,
      dreamPoints: player.dreamPoints,
      dreamPointsBreakdown: player.dreamPointsBreakdown ? {
        goals: player.dreamPointsBreakdown.goals,
        assists: player.dreamPointsBreakdown.assists,
        saves: player.dreamPointsBreakdown.saves,
        cleanSheets: player.dreamPointsBreakdown.cleanSheets,
        winBonus: player.dreamPointsBreakdown.winBonus,
        yellowCards: player.dreamPointsBreakdown.yellowCards,
        redCards: player.dreamPointsBreakdown.redCards,
        basePoints: player.dreamPointsBreakdown.basePoints,
        goalsConcededPenalty: player.dreamPointsBreakdown.goalsConcededPenalty,
        ownGoalsPenalty: player.dreamPointsBreakdown.ownGoalsPenalty,
        total: player.dreamPointsBreakdown.total
      } : undefined
    };
  }
}