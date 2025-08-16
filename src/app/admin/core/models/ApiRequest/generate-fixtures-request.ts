export interface GenerateFixturesRequest {
    seasonId: number;
    startDate: string;
    timeSlots: TimeSlot[];
}

export interface TimeSlot {
  day: number; // 0=Sunday, 1=Monday, etc.
  time: string; // HH:mm format
}