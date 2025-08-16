import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { League } from '../core/models/league';
import { Season } from '../core/models/season';
import { Team } from '../core/models/team';
import { Player } from '../core/models/player';
import { LeagueService } from '../core/services/league.service';
import { SeasonService } from '../core/services/season.service';
import { TeamService } from '../core/services/team.service';
import { PlayerService } from '../core/services/player.service';
import { ImageService } from '../../core/services/image.service';

@Component({
  selector: 'app-league-info',
  imports: [CommonModule],
  templateUrl: './league-info.component.html',
  styleUrl: './league-info.component.css'
})
export class LeagueInfoComponent implements OnInit {
  league: League | null = null;
  leagueId: number = 0;
  loading = false;
  error: string = '';

  // Active tab
  activeTab: 'seasons' | 'teams' | 'players' = 'seasons';

  // Seasons
  seasons: Season[] = [];
  seasonsLoading = false;
  seasonsError: string = '';
  seasonsCurrentPage = 1;
  seasonsItemsPerPage = 5;
  seasonsTotalItems = 0;

  // Teams
  teams: Team[] = [];
  teamsLoading = false;
  teamsError: string = '';
  teamsCurrentPage = 1;
  teamsItemsPerPage = 5;
  teamsTotalItems = 0;

  // Players
  players: Player[] = [];
  playersLoading = false;
  playersError: string = '';
  playersCurrentPage = 1;
  playersItemsPerPage = 5;
  playersTotalItems = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leagueService: LeagueService,
    private seasonService: SeasonService,
    private teamService: TeamService,
    private playerService: PlayerService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.leagueId = +params['id'];
      this.loadLeague();
      this.loadSeasons();
    });
  }

  loadLeague(): void {
    this.loading = true;
    this.leagueService.getById(this.leagueId).subscribe({
      next: (data) => {
        this.league = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Greška pri učitavanju lige...';
        this.loading = false;
      }
    });
  }

  // Tab switching
  switchTab(tab: 'seasons' | 'teams' | 'players'): void {
    this.activeTab = tab;
    switch (tab) {
      case 'seasons':
        if (this.seasons.length === 0) this.loadSeasons();
        break;
      case 'teams':
        if (this.teams.length === 0) this.loadTeams();
        break;
      case 'players':
        if (this.players.length === 0) this.loadPlayers();
        break;
    }
  }

  // Seasons methods
  loadSeasons(): void {
    this.seasonsLoading = true;
    this.seasonService.getByLeagueWithPagination(this.leagueId, this.seasonsCurrentPage, this.seasonsItemsPerPage).subscribe({
      next: (data) => {
        this.seasons = data.$values || data;
        this.seasonsTotalItems = data.totalCount || this.seasons.length;
        this.seasonsLoading = false;
      },
      error: () => {
        this.seasonsError = 'Greška pri učitavanju sezona...';
        this.seasonsLoading = false;
      }
    });
  }

  onSeasonsPageChange(page: number): void {
    this.seasonsCurrentPage = page;
    this.loadSeasons();
  }

  createSeason(): void {
    this.router.navigate([`/admin/seasons/create`], 
      { 
        queryParams: { leagueId: this.leagueId }
      });
  }

  editSeason(id: number): void {
    this.router.navigate([`/admin/seasons/edit/${id}`], {
        queryParams: { leagueId: this.leagueId }
    });
  }

  deleteSeason(id: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovu sezonu?')) {
      this.seasonService.delete(id).subscribe({
        next: () => {
          this.loadSeasons();
        },
        error: () => {
          alert('Greška pri brisanju sezone...');
        }
      });
    }
  }
  
  viewSeason(id: number): void{ 
    this.router.navigate([`/admin/seasons/${id}`], {
      state: { leagueId: this.leagueId }
    });
  }

  // Teams methods
  loadTeams(): void {
    this.teamsLoading = true;
    this.teamService.getByLeague(this.leagueId, this.teamsCurrentPage, this.teamsItemsPerPage).subscribe({
      next: (data) => {
        this.teams = data.$values || data;
        this.teamsTotalItems = data.totalCount || this.teams.length;
        this.teamsLoading = false;
      },
      error: () => {
        this.teamsError = 'Greška pri učitavanju timova...';
        this.teamsLoading = false;
      }
    });
  }

  onTeamsPageChange(page: number): void {
    this.teamsCurrentPage = page;
    this.loadTeams();
  }

  createTeam(): void {
    this.router.navigate([`/admin/teams/create`], { queryParams: { leagueId: this.leagueId } });
  }

  editTeam(id: number): void {
    this.router.navigate([`/admin/teams/edit/${id}`]);
  }

  deleteTeam(id: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovaj tim?')) {
      this.teamService.delete(id).subscribe({
        next: () => {
          this.loadTeams();
        },
        error: () => {
          alert('Greška pri brisanju tima...');
        }
      });
    }
  }

  // Players methods
  loadPlayers(): void {
    this.playersLoading = true;
    this.playerService.getByLeague(this.leagueId, this.playersCurrentPage, this.playersItemsPerPage).subscribe({
      next: (data) => {
        this.players = data.$values || data;
        this.playersTotalItems = data.totalCount || this.players.length;
        this.playersLoading = false;
      },
      error: () => {
        this.playersError = 'Greška pri učitavanju igrača...';
        this.playersLoading = false;
      }
    });
  }

  onPlayersPageChange(page: number): void {
    this.playersCurrentPage = page;
    this.loadPlayers();
  }

  createPlayer(): void {
    this.router.navigate([`/admin/players/create`], { queryParams: { leagueId: this.leagueId } });
  }

  editPlayer(id: number): void {
    this.router.navigate([`/admin/players/edit/${id}`]);
  }

  deletePlayer(id: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovog igrača?')) {
      this.playerService.delete(id).subscribe({
        next: () => {
          this.loadPlayers();
        },
        error: () => {
          alert('Greška pri brisanju igrača...');
        }
      });
    }
  }

  // Utility methods
  getImage(fileName: string): string {
    return this.imageService.getImageUrl("Leagues", fileName);
  }

  getTeamImage(fileName: string): string {
    return this.imageService.getImageUrl("Teams", fileName);
  }

  getPlayerImage(fileName: string): string {
    return this.imageService.getImageUrl("Players", fileName);
  }

  goBack(): void {
    this.router.navigate(['/admin/leagues']);
  }

  // Pagination helper methods
  getSeasonsPages(): number[] {
    const totalPages = Math.ceil(this.seasonsTotalItems / this.seasonsItemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  getTeamsPages(): number[] {
    const totalPages = Math.ceil(this.teamsTotalItems / this.teamsItemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  getPlayersPages(): number[] {
    const totalPages = Math.ceil(this.playersTotalItems / this.playersItemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}