export interface TeamListModel {
    id: number;
    name: string;
    shortName: string;
    logo: string;
    seasonsPlayed: number;
    totalGoals: number;
    totalWins: number;
    totalDraws: number;
    totalLosses: number;
    playersCount: number;
}

export interface SeasonModel {
    id: number;
    name: string;
}

export interface TeamFilters {
    seasonId: number;
    searchTerm: string;
    sortBy: 'name' | 'wins' | 'goals';
    sortDirection: 'asc' | 'desc';
}