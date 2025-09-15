export interface PaginatedPlayerResult {
    players: PlayerListModel[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PlayerListModel{
    id: number;
    firstName: string;
    lastName: string;
    image: string;
    position: string; // 'Player' or 'Goalkeeper'
    dreamTeamPoints: number;
    totalGames: number;
    totalGoals: number;
    totalAssists: number;
    totalSaves: number;
    
    // Current team info (if any)
    currentTeamId?: number;
    currentTeamName?: string;
    currentTeamLogo?: string;
    currentTeamShortName?: string;
    
    // Additional stats
    seasonsPlayed: number;
    totalWins: number;
    totalDraws: number;
    totalLosses: number;
}

export interface PlayerFilters {
  teamId: number;
  position: string; // 'all', 'player', 'goalkeeper'
  searchTerm: string;
  sortBy: 'name' | 'dreamPoints' | 'goals' | 'games' | 'team';
  sortDirection: 'asc' | 'desc';
}