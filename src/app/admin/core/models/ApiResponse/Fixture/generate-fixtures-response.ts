export interface GenerateFixturesResponse {
  isValid: boolean;
  errors: {
    $values: Array<{ message: string }>;
  }
  data?: {
    matchesCount: number;
    roundsCount: number;
    firstMatchDate: string;
    lastMatchDate: string;
  };  
}