// fixture-details.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

export interface FixtureDetails {
  id: number;
  date: string;
  time: string;
  status: 'scheduled' | 'live' | 'finished';
  matchDay: number;
  competition: string;
  venue: string;
  homeTeam: Team;
  awayTeam: Team;
  score: {
    home: number;
    away: number;
  };
  statistics: MatchStatistics;
  lineup: {
    home: Player[];
    away: Player[];
  };
  timeline: TimelineEvent[];
  mvp: MVP;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface Player {
  id: number;
  name: string;
  position: string;
  dreamPoints: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  saves?: number;
  cleanSheets?: number;
  dreamPointsBreakdown?: DreamPointsBreakdown;
}

export interface DreamPointsBreakdown {
  goals: { count: number; points: number };
  assists: { count: number; points: number };
  saves: { count: number; points: number };
  cleanSheets: { count: number; points: number };
  yellowCards: { count: number; points: number };
  redCards: { count: number; points: number };
  winBonus: { count: number; points: number };
  total: number;
}

export interface MatchStatistics {
  possession: {
    home: number;
    away: number;
  };
  shots: {
    home: number;
    away: number;
  };
  shotsOnTarget: {
    home: number;
    away: number;
  };
  saves: {
    home: number;
    away: number;
  };
  corners: {
    home: number;
    away: number;
  };
  fouls: {
    home: number;
    away: number;
  };
  yellowCards: {
    home: number;
    away: number;
  };
  redCards: {
    home: number;
    away: number;
  };
}

export interface TimelineEvent {
  id: number;
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty';
  team: 'home' | 'away';
  player: string;
  description: string;
  assistPlayer?: string;
}

export interface MVP {
  playerId: number;
  name: string;
  team: string;
  teamLogo: string;
  image: string;
  dreamPoints: number;
  performance: {
    goals: number;
    assists: number;
    saves?: number;
    rating: number;
  };
}

@Component({
  selector: 'app-fixture-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fixture-detail.component.html',
  styleUrls: ['./fixture-detail.component.css']
})
export class FixtureDetailComponent implements OnInit {
  @Input() fixtureId!: number;
  expandedPlayerId: number | null = null;
  fixture!: FixtureDetails;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute
    // Inject your fixture service here: private fixtureService: FixtureService
  ) {}

  ngOnInit() {
    // Get fixture ID from route if not provided as input
    if (!this.fixtureId) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.fixtureId = +id;
      }
    }

    if (this.fixtureId) {
      this.loadFixtureData(this.fixtureId);
    } else {
      this.error = 'No fixture ID provided';
      this.loading = false;
    }
  }

  private loadFixtureData(fixtureId: number) {
    this.loading = true;
    this.error = null;

    // Mock data for development - remove when implementing real service
    setTimeout(() => {
      this.fixture = this.getMockFixtureData();
      this.loading = false;
    }, 1000);
  }

  // Mock data method - remove when implementing real service
  private getMockFixtureData(): FixtureDetails {
    return {
      id: this.fixtureId,
      date: "2024-12-15",
      time: "20:00",
      status: "finished",
      matchDay: 15,
      competition: "Liga A",
      venue: "Sportski Centar Arena",
      homeTeam: {
        id: 1,
        name: "Red Eagles",
        logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg"
      },
      awayTeam: {
        id: 2,
        name: "Blue Sharks",
        logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg"
      },
      score: {
        home: 3,
        away: 2
      },
      statistics: {
        possession: { home: 65, away: 35 },
        shots: { home: 18, away: 12 },
        shotsOnTarget: { home: 8, away: 6 },
        saves: { home: 4, away: 14 },
        corners: { home: 1, away: 3 },
        fouls: { home: 5, away: 5 },
        yellowCards: { home: 2, away: 0 },
        redCards: { home: 0, away: 0 }
      },
      lineup: {
        home: [
          { 
            id: 1, 
            name: "Marko Petrović", 
            position: "Golman", 
            dreamPoints: 15.5, 
            goals: 0, 
            assists: 0, 
            saves: 4,
            cleanSheets: 1,
            dreamPointsBreakdown: {
              goals: { count: 0, points: 0 },
              assists: { count: 0, points: 0 },
              saves: { count: 4, points: 8 },
              cleanSheets: { count: 1, points: 6 },
              winBonus: { count: 1, points: 2 },
              yellowCards: { count: 0, points: 0 },
              redCards: { count: 0, points: 0 },
              total: 16
            }
          },
          { 
            id: 2, 
            name: "Stefan Jovanović", 
            position: "Odbrana", 
            dreamPoints: 12.2, 
            goals: 0, 
            assists: 1,
            dreamPointsBreakdown: {
              goals: { count: 0, points: 0 },
              assists: { count: 1, points: 3 },
              saves: { count: 0, points: 0 },
              cleanSheets: { count: 0, points: 0 },
              winBonus: { count: 1, points: 2 },
              yellowCards: { count: 0, points: 0 },
              redCards: { count: 0, points: 0 },
              total: 5
            }
          },
          { 
            id: 3, 
            name: "Nikola Mitrović", 
            position: "Napad", 
            dreamPoints: 18.7, 
            goals: 2, 
            assists: 0,
            dreamPointsBreakdown: {
              goals: { count: 2, points: 10 },
              assists: { count: 0, points: 0 },
              saves: { count: 0, points: 0 },
              cleanSheets: { count: 0, points: 0 },
              winBonus: { count: 1, points: 2 },
              yellowCards: { count: 0, points: 0 },
              redCards: { count: 0, points: 0 },
              total: 12
            }
          },
          { 
            id: 4, 
            name: "Aleksandar Stojanović", 
            position: "Sredina", 
            dreamPoints: 14.3, 
            goals: 1, 
            assists: 1,
            dreamPointsBreakdown: {
              goals: { count: 1, points: 5 },
              assists: { count: 1, points: 3 },
              saves: { count: 0, points: 0 },
              cleanSheets: { count: 0, points: 0 },
              winBonus: { count: 1, points: 2 },
              yellowCards: { count: 0, points: 0 },
              redCards: { count: 0, points: 0 },
              total: 10
            }
          },
          { 
            id: 5, 
            name: "Miloš Đorđević", 
            position: "Napad", 
            dreamPoints: 11.8, 
            goals: 0, 
            assists: 0, 
            yellowCards: 1,
            dreamPointsBreakdown: {
              goals: { count: 0, points: 0 },
              assists: { count: 0, points: 0 },
              saves: { count: 0, points: 0 },
              cleanSheets: { count: 0, points: 0 },
              winBonus: { count: 1, points: 2 },
              yellowCards: { count: 1, points: -1 },
              redCards: { count: 0, points: 0 },
              total: 1
            }
          }
        ],
        away: [
          { 
            id: 6, 
            name: "Luka Nikolić", 
            position: "Golman", 
            dreamPoints: 13.2, 
            goals: 0, 
            assists: 0, 
            saves: 14,
            dreamPointsBreakdown: {
              goals: { count: 0, points: 0 },
              assists: { count: 0, points: 0 },
              saves: { count: 14, points: 14 },
              cleanSheets: { count: 0, points: 0 },
              winBonus: { count: 0, points: 0 },
              yellowCards: { count: 0, points: 0 },
              redCards: { count: 0, points: 0 },
              total: 14
            }
          },
          { 
            id: 7, 
            name: "Dejan Popović", 
            position: "Odbrana", 
            dreamPoints: 10.5, 
            goals: 0, 
            assists: 0, 
            yellowCards: 1,
            dreamPointsBreakdown: {
              goals: { count: 0, points: 0 },
              assists: { count: 0, points: 0 },
              saves: { count: 0, points: 0 },
              cleanSheets: { count: 0, points: 0 },
              winBonus: { count: 0, points: 0 },
              yellowCards: { count: 1, points: -1 },
              redCards: { count: 0, points: 0 },
              total: -1
            }
          },
          { 
            id: 8, 
            name: "Vuk Marinković", 
            position: "Napad", 
            dreamPoints: 16.4, 
            goals: 1, 
            assists: 1,
            dreamPointsBreakdown: {
              goals: { count: 1, points: 5 },
              assists: { count: 1, points: 3 },
              saves: { count: 0, points: 0 },
              cleanSheets: { count: 0, points: 0 },
              winBonus: { count: 0, points: 0 },
              yellowCards: { count: 0, points: 0 },
              redCards: { count: 0, points: 0 },
              total: 8
            }
          },
          { 
            id: 9, 
            name: "Filip Radović", 
            position: "Sredina", 
            dreamPoints: 9.7, 
            goals: 1, 
            assists: 0, 
            redCards: 1,
            dreamPointsBreakdown: {
              goals: { count: 1, points: 5 },
              assists: { count: 0, points: 0 },
              saves: { count: 0, points: 0 },
              cleanSheets: { count: 0, points: 0 },
              winBonus: { count: 0, points: 0 },
              yellowCards: { count: 0, points: 0 },
              redCards: { count: 1, points: -3 },
              total: 2
            }
          },
          { 
            id: 10, 
            name: "Nemanja Kostić", 
            position: "Napad", 
            dreamPoints: 12.1, 
            goals: 0, 
            assists: 0, 
            yellowCards: 1,
            dreamPointsBreakdown: {
              goals: { count: 0, points: 0 },
              assists: { count: 0, points: 0 },
              saves: { count: 0, points: 0 },
              cleanSheets: { count: 0, points: 0 },
              winBonus: { count: 0, points: 0 },
              yellowCards: { count: 1, points: -1 },
              redCards: { count: 0, points: 0 },
              total: -1
            }
          }
        ]
      },
      timeline: [
        { id: 1, minute: 12, type: "goal", team: "home", player: "Nikola Mitrović", description: "Gol iz penala", assistPlayer: "Stefan Jovanović" },
        { id: 2, minute: 25, type: "yellow_card", team: "away", player: "Dejan Popović", description: "Žuti karton za grub prekršaj" },
        { id: 3, minute: 34, type: "goal", team: "away", player: "Vuk Marinković", description: "Gol iz slobodnog udarca" },
        { id: 4, minute: 45, type: "goal", team: "home", player: "Aleksandar Stojanović", description: "Gol iz kontranapada", assistPlayer: "Nikola Mitrović" },
        { id: 5, minute: 58, type: "goal", team: "away", player: "Filip Radović", description: "Gol glavom nakon kornera" },
        { id: 6, minute: 67, type: "yellow_card", team: "home", player: "Miloš Đorđević", description: "Žuti karton za protest" },
        { id: 7, minute: 72, type: "red_card", team: "away", player: "Filip Radović", description: "Crveni karton - drugi žuti" },
        { id: 8, minute: 89, type: "goal", team: "home", player: "Nikola Mitrović", description: "Pobednički gol u 89. minutu" }
      ],
      mvp: {
        playerId: 6,
        name: "Luka Nikolić",
        team: "Blue Sharks",
        teamLogo: "https://upload.wikimedia.org/wikipedia/fr/thumb/e/e5/Logo_Aston_Villa.svg/500px-Logo_Aston_Villa.svg.png?20090727161617",
        image: "default-player.png",
        dreamPoints: 18.7,
        performance: {
          goals: 0,
          assists: 0,
          saves: 14,
          rating: 9.5
        }
      }
    };
  }

  togglePlayerExpansion(playerId: number): void {
    this.expandedPlayerId = this.expandedPlayerId === playerId ? null : playerId;
  }


  getStatusText(status: string): string {
    switch (status) {
      case 'scheduled': return 'Zakazano';
      case 'live': return 'Uživo';
      case 'finished': return 'Završeno';
      default: return status;
    }
  }

  getStatPercentage(home: number, away: number): number {
    const total = home + away;
    return total > 0 ? (home / total) * 100 : 50;
  }

  getEventIcon(type: string): string {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellow_card': return '🟨';
      case 'red_card': return '🟥';
      case 'substitution': return '🔄';
      case 'penalty': return '🥅';
      default: return '📝';
    }
  }
}