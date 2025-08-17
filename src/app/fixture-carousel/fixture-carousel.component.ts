import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fixture } from '../core/models/fixture.model';
import { FixtureService } from '../core/services/fixture.service';
import { ApiListResponse } from '../shared/api-list-response';
import { SeasonService } from '../core/services/season.service';

@Component({
  selector: 'app-fixture-carousel',
  imports: [CommonModule],
  templateUrl: './fixture-carousel.component.html',
  styleUrl: './fixture-carousel.component.css'
})
export class FixtureCarouselComponent {
  @ViewChild('carouselContainer', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
  isHovered = false;
  fixtures: Fixture[] = [];
  isLoading = true;
  seasonId: number | null = 0;

  trackFixture(index: number, fixture: any): any {
    return fixture.id;
  }

  constructor(private fixtureService: FixtureService,
              private seasonService: SeasonService ){}

  ngOnInit(): void {
    this.loadFixtures();
  }

  loadFixtures(): void{
    this.seasonId = this.seasonService.getSeasonId();
    this.fixtureService.listCurrentRound(this.seasonId!).subscribe({
      next: (response: ApiListResponse<Fixture>) => {
        this.fixtures = response.$values
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading fixtures:', error);
        this.isLoading = false;
      }
    })
  }
  

  scrollLeft() {
    this.pauseScroll();
    this.containerRef.nativeElement.scrollBy({ left: -200, behavior: 'smooth' });
  }

  scrollRight() {
    this.pauseScroll();
    this.containerRef.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
  }

  private pauseScroll() {
    this.isHovered = true;
    clearTimeout((this as any)._resumeTimer);
    (this as any)._resumeTimer = setTimeout(() => {
      this.isHovered = false;
    }, 4000);
  }

  trackByFixtureId(index: number, fixture: Fixture): number {
    return fixture.id;
  }

  isWinningTeam(homeScore: number | null, awayScore: number | null, isHome: boolean): boolean {
    if (homeScore == null || awayScore == null) return false;
    return isHome ? homeScore > awayScore : awayScore > homeScore;
  }

  isLosingTeam(homeScore: number | null, awayScore: number | null, isHome: boolean): boolean {
    if (homeScore == null || awayScore == null) return false;
    return isHome ? homeScore < awayScore : awayScore < homeScore;
  }
}
