import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Fixture } from '../core/models/fixture.model';
import { FixtureService } from '../core/services/fixture.service';
import { ApiListResponse } from '../shared/api-list-response';
import { SeasonService } from '../core/services/season.service';
import { ImageService } from '../core/services/image.service';

@Component({
  selector: 'app-fixture-carousel',
  imports: [CommonModule, RouterModule],
  templateUrl: './fixture-carousel.component.html',
  styleUrl: './fixture-carousel.component.css'
})
export class FixtureCarouselComponent implements OnInit, OnDestroy {
  @ViewChild('fixtureTrack', { static: false }) fixtureTrack!: ElementRef<HTMLDivElement>;

  fixtures: Fixture[] = [];
  isLoading = true;
  seasonId: number | null = 0;

  // Carousel state
  currentIndex = 0;
  cardsPerView = 4;
  maxIndex = 0;
  
  // Auto-scroll state
  private autoScrollInterval: any;
  private isAutoScrollPaused = false;
  isAutoScrollActive = true;

  constructor(
    private fixtureService: FixtureService,
    private seasonService: SeasonService,
    private imageService: ImageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFixtures();
    this.cardsPerView = this.getCardsPerView();
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  loadFixtures(): void {
    this.seasonId = this.seasonService.getSeasonId();
    this.fixtureService.listCurrentRound(this.seasonId!).subscribe({
      next: (response: ApiListResponse<Fixture>) => {
        this.fixtures = response.$values;
        this.isLoading = false;
        
        // Initialize carousel after fixtures load
        setTimeout(() => {
          this.calculateMaxIndex();
          this.startAutoScroll();
        }, 100);
      },
      error: (error) => {
        console.error('Error loading fixtures:', error);
        this.isLoading = false;
      }
    });
  }

  // Carousel calculations
  private getCardsPerView(): number {
    const screenWidth = window.innerWidth;
    // iPhone 14 Pro Max is 430px width
    if (screenWidth <= 430) return 1;  // Mobile phones
    if (screenWidth <= 768) return 2;  // Tablets
    if (screenWidth <= 1024) return 3; // Small laptops
    return 4; // Desktop
  }

  private calculateMaxIndex(): void {
    // For mobile (1 card view), max index is fixtures.length - 1
    // This allows scrolling one card at a time
    if (this.cardsPerView === 1) {
      this.maxIndex = Math.max(0, this.fixtures.length - 1);
    } else {
      this.maxIndex = Math.max(0, this.fixtures.length - this.cardsPerView);
    }
  }

  // Auto-scroll functionality
  private startAutoScroll(): void {
    if (this.autoScrollInterval || this.fixtures.length <= this.cardsPerView) return;
    
    this.autoScrollInterval = setInterval(() => {
      this.moveCarousel(1);
    }, 3000); // Change slide every 3 seconds
    
    this.isAutoScrollActive = true;
  }

  private stopAutoScroll(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
    this.isAutoScrollActive = false;
  }

  private pauseAutoScroll(): void {
    this.stopAutoScroll();
    this.isAutoScrollPaused = true;
    
    // Resume after 5 seconds of inactivity
    setTimeout(() => {
      if (this.isAutoScrollPaused && this.fixtures.length > this.cardsPerView) {
        this.isAutoScrollPaused = false;
        this.startAutoScroll();
      }
    }, 5000);
  }

  // Navigation
  moveCarousel(direction: number): void {
    this.currentIndex += direction;
    
    // Loop back to start or end
    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = 0;
    } else if (this.currentIndex < 0) {
      this.currentIndex = this.maxIndex;
    }
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.pauseAutoScroll();
  }

  onPrevClick(): void {
    this.moveCarousel(-1);
    this.pauseAutoScroll();
  }

  onNextClick(): void {
    this.moveCarousel(1);
    this.pauseAutoScroll();
  }

  onCarouselMouseEnter(): void {
    this.stopAutoScroll();
  }

  onCarouselMouseLeave(): void {
    if (!this.isAutoScrollPaused && this.fixtures.length > this.cardsPerView) {
      this.startAutoScroll();
    }
  }

  // Getters for template
  get canGoPrevious(): boolean {
    return this.currentIndex > 0;
  }

  get canGoNext(): boolean {
    return this.currentIndex < this.maxIndex;
  }

  get showNavigation(): boolean {
    return this.fixtures.length > this.cardsPerView;
  }

  get totalDots(): number {
    return this.maxIndex + 1;
  }

  get dotsArray(): number[] {
    return Array.from({ length: this.totalDots }, (_, i) => i);
  }

  get trackTransform(): string {
    const gap = 20;
    let cardWidth: number;
    
    // For mobile (1 card per view), calculate based on viewport
    if (this.cardsPerView === 1) {
      const screenWidth = window.innerWidth;
      
      // Match CSS calc() values exactly
      if (screenWidth <= 390) {
        // calc(100vw - 167px)
        cardWidth = screenWidth - 167;
      } else {
        // calc(100vw - 180px) for screens <= 480px
        cardWidth = screenWidth - 180;
      }
      
      const offset = this.currentIndex * (cardWidth + gap);
      return `translateX(-${offset}px)`;
    }
    
    // For desktop/tablet, use standard calculation
    cardWidth = 256; // 16rem
    const offset = this.currentIndex * (cardWidth + gap);
    return `translateX(-${offset}px)`;
  }

  // Responsive handling
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    const newCardsPerView = this.getCardsPerView();
    if (newCardsPerView !== this.cardsPerView) {
      this.cardsPerView = newCardsPerView;
      this.calculateMaxIndex();
      this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
    }
  }

  // Keyboard navigation
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.onPrevClick();
    } else if (event.key === 'ArrowRight') {
      this.onNextClick();
    }
  }

  // Utility methods
  getLogo(fileName: string): string {
    if (!fileName) return 'default-team.png';
    return this.imageService.getImageUrl('Teams', fileName);
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

  onFixtureClick(fixture: Fixture): void {
    const fixtureDate = new Date(fixture.date);
    const now = new Date();

    if (fixtureDate < now) {
      this.router.navigate([`/fixtures/${fixture.id}`]);
    }
  }

  onTeamClick(event: Event, teamId: number): void {
    event.stopPropagation(); // Prevent fixture click
    this.router.navigate(['/teams/', teamId]);
  }
}