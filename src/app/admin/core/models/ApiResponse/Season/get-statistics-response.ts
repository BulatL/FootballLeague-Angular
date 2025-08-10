export interface GetStatisticsResponse {
  teamsCount: number;           // Number of teams participating in the season
  fixturesTotal: number;         // Total matches to be played (teamsCount * (teamsCount-1))
  fixturesPlayed: number;        // Matches that have been completed (have scores)
  fixturesUpcoming: number;      // Matches scheduled but not played yet
  roundsTotal: number;          // Total number of rounds in the season
  roundsCompleted: number;      // Rounds that are fully completed
  currentRound: number;         // The round currently being played
  goalsScored: number;          // Total goals scored in the season
  averageGoalsPerMatch: number; // Average goals per completed match
}