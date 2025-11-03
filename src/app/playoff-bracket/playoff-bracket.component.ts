import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { PlayoffService} from '../core/services/playoff.service';
import { PlayoffBracket, PlayoffFixture, PlayoffSeed } from '../core/models/playoff-model';
import { SeasonService } from '../core/services/season.service';
import { ApiListResponse } from '../shared/api-list-response';


// export interface BracketMatch {
//   id: number;
//   homeTeam: {
//     id: number;
//     name: string;
//     shortName: string;
//     logo: string;
//     score?: number;
//   };
//   awayTeam: {
//     id: number;
//     name: string;
//     shortName: string;
//     logo: string;
//     score?: number;
//   };
//   round: 'quarterfinal' | 'semifinal' | 'final';
//   matchNumber: number;
//   isFinished: boolean;
//   fixtureId?: number;
// }

@Component({
  selector: 'app-playoff-bracket',
  imports: [CommonModule],
  templateUrl: './playoff-bracket.component.html',
  styleUrl: './playoff-bracket.component.css'
})
export class PlayoffBracketComponent implements OnInit {
 playoffBracket?: PlayoffBracket;
  loading = false;
  error?: string;
  
  // Organized by rounds
  quarterfinals: PlayoffFixture[] = [];
  semifinals: PlayoffFixture[] = [];
  finals?: PlayoffFixture;
  thirdPlace?: PlayoffFixture;

  constructor(
    private playoffService: PlayoffService,
    private seasonService: SeasonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const seasonId = this.seasonService.getSeasonId();
    this.loadPlayoffBracket(seasonId);
  }

  loadPlayoffBracket(seasonId: number | null): void {
    this.loading = true;
    this.error = undefined;

    this.playoffService.getBySeasonId(seasonId).subscribe({
      next: (bracket: any) => {
        this.playoffBracket = bracket;
        this.organizeFixtures(bracket.fixtures.$values);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load playoff bracket';
        this.loading = false;
        console.error(err);
      }
    });
  }

  private organizeFixtures(fixtures: PlayoffFixture[]): void {
  this.quarterfinals = fixtures.filter(f => f.roundNumber === 1);
  this.semifinals = fixtures.filter(f => f.roundNumber === 2);

  // Finals match has roundNumber 3, bracketPosition 7
  this.finals = fixtures.find(f => f.bracketPosition === 7);
  
  // 3rd place match has roundNumber 0, bracketPosition 8
  this.thirdPlace = fixtures.find(f => f.bracketPosition === 8);
  
  console.log('Finals:', this.finals);
  console.log('Third Place:', this.thirdPlace);
}

  getTeamDisplay(fixture: PlayoffFixture, isHome: boolean): string {
    if (isHome) {
      return fixture.homeTeamName 
        ? `#${fixture.homeTeamSeedNumber} ${fixture.homeTeamName}`
        : 'TBD';
    } else {
      return fixture.awayTeamName 
        ? `#${fixture.awayTeamSeedNumber} ${fixture.awayTeamName}`
        : 'TBD';
    }
  }

  getScoreDisplay(fixture: PlayoffFixture): string {
    if (fixture.homeScore !== null && fixture.awayScore !== null) {
      return `${fixture.homeScore} - ${fixture.awayScore}`;
    }
    return fixture.fixtureDateTime 
      ? new Date(fixture.fixtureDateTime).toLocaleString()
      : 'Not Scheduled';
  }

  getTeamLogo(fileName: string): string {
    if (fileName === '') return 'default-team.png';
    return fileName;
  }

  onMatchClick(match: PlayoffFixture): void {
    if (match.fixtureId) {
      this.router.navigate(['/fixtures', match.fixtureId]);
    }
  }

  isWinner(match: PlayoffFixture | null, isHome: boolean): boolean {
    if (!match || !match.isFinished || match.homeScore === undefined || match.awayScore === undefined) {
      return false;
    }
    return isHome 
      ? match.homeScore > match.awayScore 
      : match.awayScore > match.homeScore;
  }
}