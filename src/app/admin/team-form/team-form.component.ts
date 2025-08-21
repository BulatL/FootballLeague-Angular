import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { TeamService } from '../core/services/team.service';
import { LeagueService } from '../core/services/league.service';
import { SeasonService } from '../core/services/season.service';
import { Team } from '../core/models/team';
import { League } from '../core/models/league';
import { Season } from '../core/models/season';
import { GetStatisticsResponse } from '../core/models/ApiResponse/Team/get-statistics-response';
import { ImageService } from '../../core/services/image.service';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class TeamFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  teamId?: number;
  loading = false;
  error = '';
  selectedFile?: File;
  selectedFilePreview?: string;
  currentLogoUrl?: string;
  
  // Validation error messages
  nameErrorMessage: string | null = null;
  shortNameErrorMessage: string | null = null;
  
  // Data for dropdowns
  leagues: League[] = [];
  seasons: Season[] = [];
  filteredSeasons: Season[] = [];
  
  // Team statistics (for edit mode)
  // teamStats?: GetStatisticsResponse;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private teamService: TeamService,
    private leagueService: LeagueService,
    private seasonService: SeasonService, 
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadInitialData();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.teamId = +idParam;
      this.loadTeam(this.teamId);
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      shortName: ['', [Validators.required, Validators.maxLength(5)]],
      leagueId: ['', Validators.required],
      activeSeasonId: ['']
    });

    // Watch leagueId changes to filter seasons
    this.form.get('leagueId')?.valueChanges.subscribe(leagueId => {
      if (leagueId) {
        this.loadSeasonsByLeague(leagueId); // API call to get seasons for this league
      } else {
        this.filteredSeasons = [];
      }
      this.form.patchValue({ activeSeasonId: '' }); // Clear season selection
    });
  }

  private loadInitialData(): void {
    this.leagueService.getAll().subscribe({
      next: (leaguesResponse: any) => {
        this.leagues = leaguesResponse?.$values || [];
        this.leagues = this.leagues.filter(league => league.isActive);
      },
      error: (err) => {
        console.error('Error loading leagues:', err);
        this.error = 'Failed to load leagues data.';
      }
    });

    // Load seasons separately
    // this.seasonService.getAll().subscribe({
    //   next: (seasonsResponse: any) => {
    //     this.seasons = seasonsResponse?.$values || seasonsResponse?.data || seasonsResponse || [];
    //   },
    //   error: (err) => {
    //     console.error('Error loading seasons:', err);
    //     // Don't override league error, just log it
    //     if (!this.error) {
    //       this.error = 'Failed to load seasons data.';
    //     }
    //   }
    // });
  }
   private loadSeasonsByLeague(leagueId: number): void {
    this.seasonService.listByLeague(leagueId, 1, 100).subscribe({
      next: (seasonsResponse: any) => {
        this.filteredSeasons = seasonsResponse?.seasons?.$values || [];
      },
      error: (err) => {
        console.error('Error loading seasons for league:', err);
        this.filteredSeasons = [];
        // Optional: Show a brief error message
        // this.error = 'Failed to load seasons for selected league.';
      }
    });
  }


   loadTeam(id: number): void {
    this.loading = true;

    // Load team data first
    this.teamService.getById(id).subscribe({
      next: (team: any) => {
        this.form.patchValue({
          name: team.fullName,
          shortName: team.shortName,
          leagueId: team.leagueId,
          activeSeasonId: team.activeSeasonId || ''
        });

        // Filter seasons after setting league
        this.loadSeasonsByLeague(team.leagueId);

        if (team.logo) {
          this.currentLogoUrl = team.logo
        }
        
        // Load statistics separately (optional)
        // this.loadTeamStatistics(id);
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading team:', err);
        this.error = 'Failed to load team data.';
        this.loading = false;
      }
    });
  }

  //  private loadTeamStatistics(teamId: number): void {
  //   if (this.teamService.getStatistics) {
  //     this.teamService.getStatistics(teamId).subscribe({
  //       next: (stats: GetStatisticsResponse) => {
  //         this.teamStats = stats;
  //       },
  //       error: (err) => {
  //         console.warn('Failed to load team statistics:', err);
  //         // Don't show error to user, statistics are optional
  //       }
  //     });
  //   }
  // }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo je prevelik. Maksimalna veličina je 2MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Molimo odaberite sliku (PNG, JPG, GIF).');
        return;
      }

      this.selectedFile = file;
      
      // Create preview URL for the selected file
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFilePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = undefined;
    this.selectedFilePreview = undefined;
    
    // Clear the file input
    const fileInput = document.getElementById('logo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  
  getImage(fileName: string): string {
      var imageUrl = this.imageService.getImageUrl("Teams", fileName)  
      return imageUrl;
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.clearValidationErrors();
    
    const formData = new FormData();
    
    // Team basic data
    formData.append('name', this.form.value.name);
    formData.append('shortName', this.form.value.shortName);
    formData.append('leagueId', this.form.value.leagueId.toString());
    
    // Active season (optional)
    if (this.form.value.activeSeasonId) {
      formData.append('activeSeasonId', this.form.value.activeSeasonId.toString());
    }
    
    formData.append('auditUsername', 'admin'); // Replace with actual username
    
    // Logo file (if selected)
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    // Add team ID for edit operations
    if (this.isEdit && this.teamId) {
      formData.append('id', this.teamId.toString());
    }

    const save$: Observable<any> = this.isEdit
      ? this.teamService.update(formData)
      : this.teamService.create(formData);

    save$.subscribe({
      next: (res) => {
        if (res.isValid === false && res.errors && res.errors.$values && res.errors.$values.length > 0) {
          this.handleValidationErrors(res.errors.$values);
          this.loading = false;
        } else {
          this.clearValidationErrors();
          this.router.navigate(['/admin/teams']);
        }
      },
      error: (err) => {
        console.error('Save error:', err);
        this.error = 'Failed to save team due to network/server error.';
        this.loading = false;
      }
    });
  }
  

  private handleValidationErrors(errors: any[]): void {
    errors.forEach((error: any) => {
      switch (error.propertyName?.toLowerCase()) {
        case 'name':
          this.nameErrorMessage = error.message;
          break;
        case 'shortname':
          this.shortNameErrorMessage = error.message;
          break;
        default:
          this.error = error.message || 'Validation error occurred.';
      }
    });
  }

  private clearValidationErrors(): void {
    this.nameErrorMessage = null;
    this.shortNameErrorMessage = null;
    this.error = '';
  }

  // Helper method to get league name
  getLeagueName(leagueId: number): string {
    const league = this.leagues.find(l => l.id === leagueId);
    return league ? league.name : '';
  }

  // Helper method to get season name
  getSeasonName(seasonId: number): string {
    const season = this.seasons.find(s => s.id === seasonId);
    return season ? season.name : '';
  }
}