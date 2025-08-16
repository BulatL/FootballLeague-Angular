import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SeasonService } from '../core/services/season.service';
import { TeamService } from '../core/services/team.service';
import { SeasonTeamsService } from '../core/services/seasonteams.service';
import { ImageService } from '../../core/services/image.service';
import { Team } from '../core/models/team';
import { Season } from '../core/models/season';


interface SeasonTeam {
  id: number;
  seasonId: number;
  teamId: number;
  isActive: boolean;
  joinedDate: string;
}

@Component({
  selector: 'app-season-teams',
  templateUrl: './season-teams.component.html',
  styleUrls: ['./season-teams.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class SeasonTeamsComponent implements OnInit {
  seasonId!: number;
  season?: Season;
  
  availableTeams: Team[] = [];
  filteredTeams: Team[] = [];
  currentSeasonTeams: SeasonTeam[] = [];
  selectedTeams: number[] = [];
  originalSelectedTeams: number[] = [];
  
  loading = false;
  error = '';
  
  // Filter properties
  searchTerm = '';
  showOnlySelected = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seasonService: SeasonService,
    private teamService: TeamService,
    private seasonTeamsService: SeasonTeamsService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('seasonId');
    if (idParam) {
      this.seasonId = +idParam;
      this.loadSeasonTeamsData();
    } else {
      this.router.navigate(['/admin/seasons']);
    }
  }

  private loadSeasonTeamsData(): void {
    this.loading = true;
    
    // Load season details
    this.seasonService.getById(this.seasonId).subscribe({
      next: (season) => {
        this.season = season;
        this.loadTeamsForLeague();
      },
      error: (err) => {
        console.error('Error loading season:', err);
        this.error = 'Failed to load season data.';
        this.loading = false;
      }
    });
  }

  private loadTeamsForLeague(): void {
    if (!this.season?.leagueId) return;

    // Load all teams from the same league
    this.teamService.listByLeague(this.season.leagueId).subscribe({
      next: (teams) => {
        this.availableTeams = teams.$values || [];
        this.preprocessTeamLogos();
        this.loadCurrentSeasonTeams();
      },
      error: (err) => {
        console.error('Error loading teams:', err);
        this.error = 'Failed to load teams data.';
        this.loading = false;
      }
    });
  }

  private loadCurrentSeasonTeams(): void {
    // Load teams currently in this season
    this.seasonTeamsService.listSeasonTeamsBySeasonId(this.seasonId).subscribe({
      next: (seasonTeams) => {
        this.currentSeasonTeams = seasonTeams.$values || [];
        this.selectedTeams = this.currentSeasonTeams
          .filter(st => st.isActive)
          .map(st => st.teamId);
        this.originalSelectedTeams = [...this.selectedTeams];
        this.filterTeams();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading season teams:', err);
        this.error = 'Failed to load season teams data.';
        this.loading = false;
      }
    });
  }

  private preprocessTeamLogos(): void {
    this.availableTeams.forEach(team => {
      (team as any).logoUrl = this.getTeamLogo(team.logo);
    });
  }

  filterTeams(): void {
    let filtered = [...this.availableTeams];

    // Filter by search term
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(team =>
        team.fullName.toLowerCase().includes(searchLower) ||
        team.shortName.toLowerCase().includes(searchLower)
      );
    }

    // Filter by selection status
    if (this.showOnlySelected) {
      filtered = filtered.filter(team => this.isTeamSelected(team.id));
    }

    this.filteredTeams = filtered;
  }

  toggleTeam(teamId: number, event: any): void {
    if (event.target.checked) {
      if (!this.selectedTeams.includes(teamId)) {
        this.selectedTeams.push(teamId);
      }
    } else {
      this.selectedTeams = this.selectedTeams.filter(id => id !== teamId);
    }
  }

  selectAllTeams(): void {
    this.selectedTeams = [...this.availableTeams.map(team => team.id)];
  }

  deselectAllTeams(): void {
    this.selectedTeams = [];
  }

  isTeamSelected(teamId: number): boolean {
    return this.selectedTeams.includes(teamId);
  }

  isTeamInSeason(teamId: number): boolean {
    return this.currentSeasonTeams.some(st => st.teamId === teamId && st.isActive);
  }

  hasChanges(): boolean {
    if (this.selectedTeams.length !== this.originalSelectedTeams.length) {
      return true;
    }
    return this.selectedTeams.some(id => !this.originalSelectedTeams.includes(id));
  }

  getCurrentlyInSeason(): number {
    return this.currentSeasonTeams.filter(st => st.isActive).length;
  }

  getTeamStatusClass(teamId: number): string {
    if (this.isTeamSelected(teamId) && !this.originalSelectedTeams.includes(teamId)) {
      return 'new';
    }
    if (this.isTeamInSeason(teamId)) {
      return 'existing';
    }
    if (this.isTeamSelected(teamId)) {
      return 'selected';
    }
    return '';
  }

  getTeamStatusText(teamId: number): string {
    if (this.isTeamSelected(teamId) && !this.originalSelectedTeams.includes(teamId)) {
      return 'Novi';
    }
    if (this.isTeamInSeason(teamId)) {
      return 'U sezoni';
    }
    if (this.isTeamSelected(teamId)) {
      return 'Izabran';
    }
    return '';
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterTeams();
  }

  saveChanges(): void {
    if (!this.hasChanges()) return;

    this.loading = true;
    
    const teamsToAdd = this.selectedTeams.filter(id => !this.originalSelectedTeams.includes(id));
    const teamsToRemove = this.originalSelectedTeams.filter(id => !this.selectedTeams.includes(id));

    const updateData = {
      seasonId: this.seasonId,
      teamsToAdd: teamsToAdd,
      teamsToRemove: teamsToRemove,
      auditUsername: "admin"
    };
    this.seasonTeamsService.updateSeasonTeams(updateData).subscribe({
      next: (response) => {
        if (response.isValid == true) {
          this.originalSelectedTeams = [...this.selectedTeams];
          this.loadCurrentSeasonTeams(); // Refresh data
          // Show success message
          alert(`Uspešno ažurirani timovi! Dodano: ${teamsToAdd.length}, Uklonjeno: ${teamsToRemove.length}`);
        } 
        else {
           if (response.errors && response.errors.$values.length > 0) {
            // Display all validation errors
            this.error = response.errors.$values
                                           .map((err: any) => err.message)
                                           .join('\n'); // or ', ' if you want them comma-separated
          } else {
            // Fallback to general message
            this.error = response.message || 'Failed to update season teams.';
          }
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error updating season teams:', err);
        
        // Check if it's a validation error response
        if (err.error && err.error.errors && err.error.errors.length > 0) {
          this.error = err.error.errors.join('\n');
        } else if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Failed to save changes due to network error.';
        }
        
        this.loading = false;
      }
    });
  }

  getTeamLogo(logoFileName: string): string {
    if (!logoFileName) return 'public/default-team.png';
    var logoResult = this.imageService.getImageUrl('Teams', logoFileName);
    return logoResult
  }

  onImageError(event: any): void {
    event.target.src = 'public/default-team.png';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  trackByTeamId(index: number, team: Team): number {
    return team.id;
  }
}