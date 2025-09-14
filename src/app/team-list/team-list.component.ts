import { Component, OnInit, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule  } from '@angular/router';
import { TeamListModel, SeasonModel, TeamFilters } from '../core/models/team-list-model';
import { ImageService } from '../core/services/image.service';
import { TeamService } from '../core/services/team.service';
import { SeasonService } from '../core/services/season.service';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-team-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.css'
})
export class TeamListComponent implements OnInit{
  teams: TeamListModel[] = [];
  seasons: SeasonModel[] = [];
  filters: TeamFilters = {
    seasonId: 0,
    searchTerm: '',
    sortBy: 'name',
    sortDirection: 'desc'
  };

    
  // Loading states
  loading = false;
  error: string | null = null;

  constructor(
    private teamService: TeamService,
    private seasonService: SeasonService,
    private imageService: ImageService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

   async loadInitialData() {
    this.loading = true;
    this.error = null;

    try {
      // Load seasons for filter dropdowns
      Promise.all([
        this.loadSeasons()
      ]);

      // Load teams with default filters
      this.loadTeams();
    } catch (error) {
      this.error = 'Failed to load data';
      console.error('Error loading initial data:', error);
    } finally {
      this.loading = false;
    }
  }


  loadSeasons() {
    this.seasonService.getAll().subscribe({
      next:(seasons: any) => {
        this.seasons = seasons.$values;
      },
      error: (error) => {
        console.error('Error loading teams:', error);
        this.loading = false;
      }
    });
  }

  loadTeams(){
    this.loading = true;
    this.teamService.listTeams(this.filters).subscribe({
      next: (teams: any) => {
        if(teams.$values.length > 0){
          this.teams = teams.$values;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading teams:', error);
        this.loading = false;
      }
    });
  }

   onSeasonChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.filters.seasonId = parseInt(target.value) || 0;
    // Don't load teams automatically - wait for filter button
  }

  onSearchTermChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filters.searchTerm = target.value.trim();
    // Don't load teams automatically - wait for filter button
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

  onFilterClick() {
    // Reload teams from server with current filters
    this.loadTeams();
  }

  onResetClick() {
    this.filters = {
      seasonId: 0,
      searchTerm: '',
      sortBy: 'name',
      sortDirection: 'desc'
    };
    this.loadTeams();
  }

  getTeamLogo(fileName: string){
    if(fileName == "")
        return "default-team.png";
    return this.imageService.getImageUrl('Teams', fileName);
  }

  onTeamClick(teamId: number): void {
    this.router.navigate([`/teams/${teamId}`]);
  }
}