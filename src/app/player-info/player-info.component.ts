import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  dreamPoints: number;
  statistics: PlayerStatistics;
  fixtures: PlayerFixture[];
  trophies: Trophy[];
  seasonStats: SeasonStats[];
}

export interface PlayerStatistics {
  gamesPlayed: number;
  wins: number;
  goals: number;
  assists: number;
  trophiesCount: number;
}

export interface PlayerFixture {
  id: number;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  homeScore: number;
  awayScore: number;
  playerTeam: string;
  matchDay: number;
  competition: string;
}

export interface Trophy {
  id: number;
  name: string;
  image: string;
  season: string;
  description?: string;
}

export interface SeasonStats {
  season: string;
  team: string;
  teamLogo: string;
  gamesPlayed: number;
  wins: number;
  goals: number;
  assists: number;
}

@Component({
  selector: 'app-player-info',
  imports: [CommonModule],
  templateUrl: './player-info.component.html',
  styleUrl: './player-info.component.css'
})
export class PlayerInfoComponent {
@Input() playerId!: number;
  
  // Mock data - replace with actual service call
  player: Player = {
    id: 1,
    firstName: "Marko",
    lastName: "Petrović",
    image: "default-player.png",
    dreamPoints: 1250,
    statistics: {
      gamesPlayed: 45,
      wins: 28,
      goals: 15,
      assists: 8,
      trophiesCount: 3
    },
    fixtures: [
      {
        id: 1,
        date: "2024-12-15",
        homeTeam: "Red Eagles",
        awayTeam: "Blue Sharks",
        homeTeamLogo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
        awayTeamLogo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
        homeScore: 2,
        awayScore: 1,
        playerTeam: "Red Eagles",
        matchDay: 15,
        competition: "Liga A"
      },
      {
        id: 2,
        date: "2024-12-08",
        homeTeam: "Green Lions",
        awayTeam: "Red Eagles",
        homeTeamLogo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
        awayTeamLogo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
        homeScore: 0,
        awayScore: 3,
        playerTeam: "Red Eagles",
        matchDay: 14,
        competition: "Liga A"
      },
      {
        id: 3,
        date: "2024-12-01",
        homeTeam: "Red Eagles",
        awayTeam: "Purple Panthers",
        homeTeamLogo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
        awayTeamLogo: "https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg",
        homeScore: 1,
        awayScore: 1,
        playerTeam: "Red Eagles",
        matchDay: 13,
        competition: "Liga A"
      }
    ],
    trophies: [
      {
        id: 1,
        name: "Šampion Liga A",
        image: "trophy.jpeg",
        season: "2023/24",
        description: "Prvak lige u sezoni 2023/24"
      },
      {
        id: 2,
        name: "Najbolji Strelac",
        image: "trophy.jpeg",
        season: "2023/24",
        description: "Najuspešniji strelac sezone"
      },
      {
        id: 3,
        name: "MVP Finala",
        image: "trophy.jpeg",
        season: "2023/24",
        description: "Najkorisniji igrač finala"
      }
    ],
    seasonStats: [
      {
        season: "2023/24",
        team: "Manchester United",
        teamLogo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
        gamesPlayed: 20,
        wins: 15,
        goals: 8,
        assists: 5
      },
      {
        season: "2022/23",
        team: "Manchester United",
        teamLogo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
        gamesPlayed: 18,
        wins: 10,
        goals: 5,
        assists: 2
      },
      {
        season: "2021/22",
        team: "Real Madrid",
        teamLogo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
        gamesPlayed: 7,
        wins: 3,
        goals: 2,
        assists: 1
      }
    ]
  };

  ngOnInit() {
    // Load player data based on playerId
    // this.loadPlayerData(this.playerId);
  }

  private loadPlayerData(playerId: number) {
    // Implement actual data loading logic here
    // this.playerService.getPlayer(playerId).subscribe(data => this.player = data);
  }
}