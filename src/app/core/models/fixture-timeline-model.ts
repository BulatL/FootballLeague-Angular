export interface FixtureTimelineModel {
  minute: number;
  type: EventType;
  player: string;
  description: string;
  assistPlayer?: string;
  team: 'home' | 'away';
}

export type EventType = 
  | 'goal' 
  | 'yellow-card' 
  | 'red-card' 
  | 'substitution' 
  | 'penalty' 
  | 'penalty_missed' 
  | 'own-goal'
  | 'free-kick'
  | 'corner'
  | 'offside'
  | 'foul';

// If you need the fixture to include timeline
export interface FixtureWithTimeline {
  // ... your existing fixture properties
  timeline: FixtureTimelineModel[];
  homeTeam: {
    name: string;
    logo: string;
  };
  awayTeam: {
    name: string;
    logo: string;
  };
}

// Helper function type for the template
export interface TimelineHelpers {
  getEventIcon(eventType: EventType): string;
}

// Example implementation for the component
export class TimelineEventHelper {
  static getEventIcon(eventType: EventType): string {
    switch (eventType) {
      case 'goal':
        return '⚽';
      case 'yellow-card':
        return '🟨';
      case 'red-card':
        return '🟥';
      case 'penalty':
        return '⚽';
      case 'penalty_missed':
        return '⚽X';
      case 'own-goal':
        return '⚽';
      case 'free-kick':
        return '⚽';
      case 'corner':
        return '📐';
      default:
        return '•';
    }
  }

  static getEventDescription(event: FixtureTimelineModel): string {
    switch (event.type) {
      case 'goal':
        return 'Gol';
      case 'yellow-card':
        return 'Žuti karton';
      case 'red-card':
        return 'Crveni karton';
      case 'penalty':
        return 'Penal';
      case 'penalty_missed':
        return 'Penal Promasen';
      case 'own-goal':
        return 'Autogoal';
      case 'free-kick':
        return 'Slobodan udarac';
      default:
        return event.description;
    }
  }
}