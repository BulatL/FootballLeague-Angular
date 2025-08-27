import { Component, OnInit, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule  } from '@angular/router';
import { TeamDetailFixture, TeamDetailModel, TeamLineup } from '../core/models/team-detail-model';
import { ImageService } from '../core/services/image.service';
import { FixtureService } from '../core/services/fixture.service';
import { ApiListResponse } from '../shared/api-list-response';
import { TeamService } from '../core/services/team.service';
import { PlayerService } from '../core/services/player.service';

@Component({
  selector: 'app-team-detail',
  imports: [CommonModule, RouterModule ],
  templateUrl: './team-detail.component.html',
  styleUrl: './team-detail.component.css'
})
export class TeamDetailComponent {
  loading = true;
  loadingFixtures = true;
  loadingPlayers = true;
  error: string | null = null;
  @Input() teamId!: number;
  team!: TeamDetailModel;
  expandedPlayerId: number | null = null;

  currentIndex = 0;
  cardWidth = 280; 
  cardsPerView: number = 4;
  maxIndex: number = 0;
  autoScrollInterval: any;

  constructor(private teamService: TeamService,
                private route: ActivatedRoute,
                private imageService: ImageService,
                private fixtureService: FixtureService,
                private playerService: PlayerService,
                private router: Router){}
  
  
  ngOnInit() {
    if (!this.teamId) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.teamId = +id;
      }
    }
    
    if (this.teamId) {
      this.loadPlayerData(this.teamId);
    } else {
      this.error = 'No team id provided';
      this.loading = false;
    }
  }

  private loadPlayerData(teamId: number) {
    this.loading = true;
    this.error = null;
    
    this.teamService.getInfo(teamId).subscribe({
      next: (response: TeamDetailModel) => {
        this.team = response;
        this.loading = false;
        this.loadFixtures(this.teamId)
        this.loadLineup(this.teamId);
      },
      error: (error) => {
        this.error = 'Failed to load team data';
        this.loading = false;
        console.error('Error loading team:', error);
      }
    });
  }

  private loadFixtures(teamId: number){
    this.loadingFixtures = true;
    this.error = null;
    
    this.fixtureService.getByPlayer(teamId).subscribe({
      next: (response: ApiListResponse<TeamDetailFixture>) => {
        this.team.fixtures = response.$values;
        this.loadingFixtures = false;
        
        this.calculateCardsPerView();
        this.calculateMaxIndex();
        this.updateCarousel();

      },
      error: (error) => {
        this.error = 'Failed to load team data';
        this.loading = false;
        console.error('Error loading team:', error);
      }
    });
  }

  private loadLineup(teamId: number){
    this.loadingPlayers = true;
    this.error = null;
    
    this.playerService.getByTeam(teamId).subscribe({
      next: (response: ApiListResponse<TeamLineup>) => {
        this.team.lineup = response.$values;
        this.loadingPlayers = false;
      },
      error: (error) => {
        this.error = 'Failed to load players data';
        this.loading = false;
        console.error('Error loading players:', error);
      }
    });
  }

  getTeamLogo(fileName: string): string {
    // if(fileName == "")
    //     return "default-team.png";
    // return fileName;
    return this.imageService.getImageUrl('Teams', fileName);
  }
  
  getPlayerImage(fileName: string): string {
    // if(fileName == "")
    //     return "default-player.png";
    // return fileName;
    return this.imageService.getImageUrl('Players', fileName);
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
    this.maxIndex = Math.max(0, this.team.fixtures.length - this.cardsPerView);
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
    return this.team.fixtures.length > this.cardsPerView;
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
  
  togglePlayerExpansion(playerId: number): void {
    this.expandedPlayerId = this.expandedPlayerId === playerId ? null : playerId;
  }
}
