import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule  } from '@angular/router';
import { PlayerListModel, PlayerFilters } from '../core/models/player-list-model';
import { TeamListModel } from '../core/models/team-list-model';
import { SeasonModel } from '../core/models/season-model';
import { ImageService } from '../core/services/image.service';
import { TeamService } from '../core/services/team.service';
import { SeasonService } from '../core/services/season.service';
import { FormsModule } from "@angular/forms";
import { PlayerService } from '../core/services/player.service';

@Component({
  selector: 'app-player-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.css'
})
export class PlayerListComponent implements OnInit {
  players: PlayerListModel[] = [];
  seasons: SeasonModel[] = [];
  teams: TeamListModel[] = [];
  loading = true;
  error: string | null = null;
  currentPage: number = 1;
  pageSize: number = 15;
  hasNextPage: boolean = false;
  hasPreviousPage: boolean = false;
  totalPages: number = 1;
  totalCount: number = 1;

  filters: PlayerFilters = {
    teamId: 0,
    position: 'all',
    searchTerm: '',
    sortBy: 'dreamPoints',
    sortDirection: 'desc',
  };

   constructor(
    private playerService: PlayerService,
    private seasonService: SeasonService,
    private teamService: TeamService,
    private imageService: ImageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  async loadInitialData() {
    this.loading = true;
    this.error = null;

    try {
      Promise.all([
        // this.loadSeasons(),
        this.loadTeams()
      ]);

      this.loadPlayers();
    } catch (error) {
      this.error = 'Failed to load data';
      console.error('Error loading initial data:', error);
    } finally {
      this.loading = false;
    }
  }


  loadSeasons() {
    this.loading = true;
    this.seasonService.getAll().subscribe({
      next:(seasons: any) => {
        this.seasons = seasons.$values;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading seasons:', error);
        this.loading = false;
      }
    });
  }

  loadTeams(){
    console.log('load teams');
    this.loading = true;
    this.teamService.getAll().subscribe({
      next: (teams: any) => {
        this.teams = teams.$values;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading teams:', error);
        this.loading = false;
      }
    });
  }

  loadPlayers(){
    this.loading = true;
    console.log(this.filters);
    this.playerService.listPlayers(this.filters, this.currentPage, this.pageSize).subscribe({
      next: (result: any) => {
        console.log(result);
        if(result.totalCount > 0){
          this.players = result.players.$values;
        }
        this.totalCount = result.totalCount;
        this.totalPages = result.totalPages;
        this.hasNextPage = result.hasNextPage;
        this.hasPreviousPage = result.hasPreviousPage;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading players:', error);
        this.loading = false;
      }
    });
  }

  onTeamChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.filters.teamId = parseInt(target.value) || 0;
  }

  onPositionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.filters.position = target.value;
  }

  onSearchTermChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filters.searchTerm = target.value.trim();
  }

  onSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const sortBy = target.value;
    
    if (this.filters.sortBy === sortBy) {
      // Toggle direction if same field
      this.filters.sortDirection = this.filters.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // New field, default to desc for numeric fields, asc for name
      this.filters.sortBy = sortBy as any;
      this.filters.sortDirection = sortBy === 'name' ? 'asc' : 'desc';
    }
    // Don't load teams automatically - wait for filter button
  }

  // Reset to page 1 when filters change
  onFilterClick() {
    this.currentPage = 1;
    this.loadPlayers();
  }

  onResetClick() {
    this.filters = {
      teamId: 0,
      position: 'all',
      searchTerm: '',
      sortBy: 'dreamPoints',
      sortDirection: 'desc'
    };
    this.loadTeams();
  }
  
  getPlayerImage(fileName: string): string {
    if(fileName == "")
        return "default-player.png";
    return this.imageService.getImageUrl('Teams', fileName);
  }

  getTeamLogo(fileName: string | undefined){
    if(fileName == "" || fileName == null || fileName == undefined)
        return "default-team.png";
    return this.imageService.getImageUrl('Teams', fileName);
  }

   onPlayerClick(playerId: number) {
    this.router.navigate(['/players', playerId]);
  }

  onTeamClick(teamId: number): void {
    this.router.navigate([`/teams/${teamId}`]);
  }

  getPlayerFullName(player: PlayerListModel): string {
    return `${player.firstName} ${player.lastName}`;
  }

  isGoalkeeper(player: PlayerListModel): boolean {
    return player.position.toLowerCase() === 'goalkeeper';
  }
  
  get currentTeamName(): string {
    if (this.filters.teamId === 0) return 'Svi timovi';
    const team = this.teams.find(t => t.id === this.filters.teamId);
    return team ? team.name : 'Nepoznat tim';
  }

  // Getter for position filter display
  get currentPositionName(): string {
    switch (this.filters.position) {
      case 'player': return 'Igrač';
      case 'goalkeeper': return 'Golman';
      default: return 'Sve pozicije';
    }
  }
  
  // Pagination methods
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPlayers();
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage() {
    console.log(this.hasNextPage);
    if (this.hasNextPage) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.hasPreviousPage) {
      this.goToPage(this.currentPage - 1);
    }
  }


}
