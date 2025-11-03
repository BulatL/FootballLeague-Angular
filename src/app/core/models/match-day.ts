export interface MatchDay {
  id: number;
  roundNumber: number;
  isFinished: boolean;
  isCurrent: boolean;
  isPlayoff: boolean;
  roundName: string | null;
}