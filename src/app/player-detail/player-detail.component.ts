import { Component, OnInit, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule  } from '@angular/router';
import { PlayerDetailFixture, PlayerDetailModel } from '../core/models/player-detail-model';
import { PlayerService } from '../core/services/player.service';
import { ImageService } from '../core/services/image.service';
import { FixtureService } from '../core/services/fixture.service';
import { ApiListResponse } from '../shared/api-list-response';


@Component({
  selector: 'app-player-detail',
  imports: [CommonModule, RouterModule ],
  templateUrl: './player-detail.component.html',
  styleUrl: './player-detail.component.css'
})
export class PlayerDetailComponent {
  loading = true;
  loadingFixtures = true;
  error: string | null = null;
  @Input() playerId!: number;
  player!: PlayerDetailModel;

  currentIndex = 0;
  cardWidth = 280; 
  cardsPerView: number = 4;
  maxIndex: number = 0;
  autoScrollInterval: any;

  constructor(private playerService: PlayerService,
              private route: ActivatedRoute,
              private imageService: ImageService,
              private fixtureService: FixtureService,
              private router: Router){}


  ngOnInit() {
    if (!this.playerId) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.playerId = +id;
      }
    }
    
    if (this.playerId) {
      this.loadPlayerData(this.playerId);
    } else {
      this.error = 'No player id provided';
      this.loading = false;
    }
  }

  private loadPlayerData(playerId: number) {
    this.loading = true;
    this.error = null;
    
    this.playerService.getInfo(playerId).subscribe({
      next: (response: PlayerDetailModel) => {
        this.player = response;
        this.loading = false;
        this.loadFixtures(this.player.playerTeamId)
      },
      error: (error) => {
        this.error = 'Failed to load player data';
        this.loading = false;
        console.error('Error loading player:', error);
      }
    });
  }

  private loadFixtures(playerTeamId: number){
     this.loadingFixtures = true;
    this.error = null;
    
    this.fixtureService.getByPlayer(playerTeamId).subscribe({
      next: (response: ApiListResponse<PlayerDetailFixture>) => {
        console.log(response);
        this.player.fixtures = response.$values;
        this.loadingFixtures = false;
        
        this.calculateCardsPerView();
        this.calculateMaxIndex();
        this.updateCarousel();

      },
      error: (error) => {
        this.error = 'Failed to load player data';
        this.loading = false;
        console.error('Error loading player:', error);
      }
    });
  }

  getTeamLogo(fileName: string): string {
    if(fileName == "")
        return "default-team.png";
    return this.imageService.getImageUrl('Teams', fileName);
  }
  
  getPlayerImage(fileName: string): string {
    if(fileName == "")
        return "default-player.png";
    return this.imageService.getImageUrl('Players', fileName);
  }
  
  onTrophyClick(trophy: any): void {
  if (trophy.fixtureId !== null) {
    this.router.navigate(['/fixtures/', trophy.fixtureId]);
    }
  }
  isWinningTeam(homeScore: number | null, awayScore: number | null, isHome: boolean): boolean {
    if (homeScore == null || awayScore == null) return false;
    return isHome ? homeScore > awayScore : awayScore > homeScore;
  }

  isLosingTeam(homeScore: number | null, awayScore: number | null, isHome: boolean): boolean {
    if (homeScore == null || awayScore == null) return false;
    return isHome ? homeScore < awayScore : awayScore < homeScore;
  }
  // Your existing methods remain the same
  onFixtureClick(fixtureId: number): void {
    this.router.navigate(['/fixtures', fixtureId]);
  }


  gOnDestroy(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    const newCardsPerView = this.getCardsPerView();
    if (newCardsPerView !== this.cardsPerView) {
      this.cardsPerView = newCardsPerView;
      this.calculateMaxIndex();
      this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
      this.updateCarousel();
    }
  }

  private calculateCardsPerView(): void {
    this.cardsPerView = this.getCardsPerView();
  }

  private getCardsPerView(): number {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 480) return 1;
    if (screenWidth <= 768) return 2;
    if (screenWidth <= 1024) return 3;
    return 4; // Desktop
  }

  private calculateMaxIndex(): void {
    this.maxIndex = Math.max(0, this.player.fixtures.length - this.cardsPerView);
  }

  private updateCarousel(): void {
    // The actual transform will be handled by CSS and Angular's property binding
  }

  moveCarousel(direction: number): void {
    this.currentIndex += direction;
    this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.maxIndex));
    this.updateCarousel();
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.updateCarousel();
  }

  get canGoPrevious(): boolean {
    return this.currentIndex > 0;
  }

  get canGoNext(): boolean {
    return this.currentIndex < this.maxIndex;
  }

  get showNavigation(): boolean {
    return this.player.fixtures.length > this.cardsPerView;
  }

  get totalDots(): number {
    return this.maxIndex + 1;
  }

  get dotsArray(): number[] {
    return Array.from({ length: this.totalDots }, (_, i) => i);
  }

  get trackTransform(): string {
    const cardWidth = 256 + 24; // 16rem + 1.5rem gap (converted to px)
    const offset = this.currentIndex * cardWidth;
    return `translateX(-${offset}px)`;
  }

  private startAutoScroll(): void {
    this.autoScrollInterval = setInterval(() => {
      if (this.currentIndex >= this.maxIndex) {
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
      this.updateCarousel();
    }, 3000);
  }
  

  onTeamClick(teamId: number){
    this.router.navigate(['/teams/', teamId]);
  }
}