import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface BracketMatch {
  id: number;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    logo: string;
    score?: number;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    logo: string;
    score?: number;
  };
  round: 'quarterfinal' | 'semifinal' | 'final';
  matchNumber: number;
  isFinished: boolean;
  fixtureId?: number;
}

@Component({
  selector: 'app-playoff-bracket',
  imports: [CommonModule],
  templateUrl: './playoff-bracket.component.html',
  styleUrl: './playoff-bracket.component.css'
})
export class PlayoffBracketComponent implements OnInit {
  quarterfinals: BracketMatch[] = [];
  semifinals: BracketMatch[] = [];
  final: BracketMatch | null = null;
  champion: any = null;
  loading = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadBracketData();
  }

  private loadBracketData(): void {
    // TODO: Replace with actual API call
    // This is mock data - you'll need to connect to your actual API
    this.quarterfinals = [
      {
        id: 1,
        homeTeam: { id: 1, name: 'Team 1', shortName: 'TM1', logo: 'default-team.png', score: 3 },
        awayTeam: { id: 8, name: 'Team 8', shortName: 'TM8', logo: 'default-team.png', score: 1 },
        round: 'quarterfinal',
        matchNumber: 1,
        isFinished: true,
        fixtureId: 101
      },
      {
        id: 2,
        homeTeam: { id: 4, name: 'Team 4', shortName: 'TM4', logo: 'default-team.png', score: 2 },
        awayTeam: { id: 5, name: 'Team 5', shortName: 'TM5', logo: 'default-team.png', score: 2 },
        round: 'quarterfinal',
        matchNumber: 2,
        isFinished: true,
        fixtureId: 102
      },
      {
        id: 3,
        homeTeam: { id: 2, name: 'Team 2', shortName: 'TM2', logo: 'default-team.png', score: 4 },
        awayTeam: { id: 7, name: 'Team 7', shortName: 'TM7', logo: 'default-team.png', score: 2 },
        round: 'quarterfinal',
        matchNumber: 3,
        isFinished: true,
        fixtureId: 103
      },
      {
        id: 4,
        homeTeam: { id: 3, name: 'Team 3', shortName: 'TM3', logo: 'default-team.png', score: 1 },
        awayTeam: { id: 6, name: 'Team 6', shortName: 'TM6', logo: 'default-team.png', score: 3 },
        round: 'quarterfinal',
        matchNumber: 4,
        isFinished: true,
        fixtureId: 104
      }
    ];

    this.semifinals = [
      {
        id: 5,
        homeTeam: { id: 1, name: 'Team 1', shortName: 'TM1', logo: 'default-team.png', score: 2 },
        awayTeam: { id: 4, name: 'Team 4', shortName: 'TM4', logo: 'default-team.png', score: 1 },
        round: 'semifinal',
        matchNumber: 1,
        isFinished: true,
        fixtureId: 105
      },
      {
        id: 6,
        homeTeam: { id: 2, name: 'Team 2', shortName: 'TM2', logo: 'default-team.png', score: 0 },
        awayTeam: { id: 6, name: 'Team 6', shortName: 'TM6', logo: 'default-team.png', score: 2 },
        round: 'semifinal',
        matchNumber: 2,
        isFinished: true,
        fixtureId: 106
      }
    ];

    this.final = {
      id: 7,
      homeTeam: { id: 1, name: 'Team 1', shortName: 'TM1', logo: 'default-team.png', score: 3 },
      awayTeam: { id: 6, name: 'Team 6', shortName: 'TM6', logo: 'default-team.png', score: 2 },
      round: 'final',
      matchNumber: 1,
      isFinished: true,
      fixtureId: 107
    };

    this.champion = { id: 1, name: 'Team 1', shortName: 'TM1', logo: 'default-team.png' };
    
    this.loading = false;
  }

  getTeamLogo(fileName: string | undefined): string {
    if (fileName === '' || fileName === undefined) 
      return 'default-team.png';
    return fileName;
  }

  onMatchClick(match: BracketMatch| null): void {
    if(match == null)
      return;

    if (match.fixtureId) {
      this.router.navigate(['/fixtures', match.fixtureId]);
    }
  }

  isWinner(match: BracketMatch | null, isHome: boolean): boolean {
    if (!match || !match.isFinished || match.homeTeam.score === undefined || match.awayTeam.score === undefined) {
      return false;
    }
    return isHome 
      ? match.homeTeam.score > match.awayTeam.score 
      : match.awayTeam.score > match.homeTeam.score;
  }
}