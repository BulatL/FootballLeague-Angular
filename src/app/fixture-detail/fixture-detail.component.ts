// fixture-details.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FixtureService } from '../core/services/fixture.service';
import { ImageService } from '../core/services/image.service';
import { FixtureDetailModel } from '../core/models/fixture-detail-mode';
import { GetFixtureLineupResponse } from '../core/models/fixture-lineup-response.mode';
import { FixtureTimelineModel } from '../core/models/fixture-timeline-model';

@Component({
  selector: 'app-fixture-detail',
  imports: [CommonModule],
  templateUrl: './fixture-detail.component.html',
  styleUrls: ['./fixture-detail.component.css']
})
export class FixtureDetailComponent implements OnInit {
  @Input() fixtureId!: number;
  expandedPlayerId: number | null = null;
  fixture!: FixtureDetailModel;
  fixtureLineupResponse!: GetFixtureLineupResponse;
  fixtureTimeline!: FixtureTimelineModel[];

  loading = true;
  loadingFixtureLineupResponse = true;
  loadingFixtureTimeline = true;
  error: string | null = null;
  isFixtureFinished: boolean = false;
  isOfficialResul: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fixtureService: FixtureService,
    private imageService: ImageService,
    private router: Router
  ) {}

  ngOnInit() {
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
    
    this.fixtureService.get(fixtureId).subscribe({
      next: (response: FixtureDetailModel) => {
        this.fixture = response;
        this.loading = false;
        if(this.fixture.isFinished){
          if((this.fixture.homeShootsOnTarget === 0 && this.fixture.homeTeamScore === 3) ||
             (this.fixture.awayShootsOnTarget === 0 && this.fixture.awayTeamScore === 3)){
              this.isOfficialResul = true;
             }

          this.isFixtureFinished = true;
          this.getFixtureLineup(fixtureId)
          this.getFixtureTimeline(fixtureId);
        }
      },
      error: (error) => {
        this.error = 'Failed to load fixture data';
        this.loading = false;
        console.error('Error loading fixture:', error);
      }
    });
  }

  getFixtureLineup(fixtureId: number){
    this.fixtureService.getFixtureLineup(fixtureId).subscribe({
    next: (response: any) => {
        this.fixtureLineupResponse = response;
        this.loadingFixtureLineupResponse = false;
      },
      error: (error) => {
        this.error = 'Failed to load fixture lineup ';
        this.loadingFixtureLineupResponse = false;
        console.error('Error loading fixture lineup:', error);
      }
    });
  }

  getFixtureTimeline(fixtureId: number){
    this.fixtureService.getFixtureTimeline(fixtureId).subscribe({
    next: (response: any) => {
        this.fixtureTimeline = response.timeline.$values;
        this.loadingFixtureTimeline = false;
      },
      error: (error) => {
        this.error = 'Failed to load fixture timeline ';
        this.loadingFixtureTimeline = false;
        console.error('Error loading fixture timeline:', error);
      }
    });
  }

  // Mock data method - remove when implementing real service

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
      case 'yellow-card': return '🟨';
      case 'red-card': return '🟥';
      case 'penalty': return '🥅';
      case 'penalty_missed': return '🥅X';
      case 'free-kick': return '⚽';
      default: return '📝';
    }
  }
  
  getTeamLogo(fileName: string): string {
    return this.imageService.getImageUrl('Teams', fileName);
  }
  
  getPlayerLogo(fileName: string): string {
    return this.imageService.getImageUrl('Players', fileName);
  }

  getPositionInSerbian(position: string): string {
  switch (position) {
    case 'Goalkeeper':
      return 'Golman';
    case 'Player':
      return 'Igrač';
    default:
      return position; 
    }
  }

  onPlayerClick(playerId: number){
    this.router.navigate(['/players/', playerId]);
  }
  
  onTeamClick(teamId: number){
    this.router.navigate(['/teams/', teamId]);
  }
}