import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { PlayerService } from '../core/services/player.service';
import { TeamService } from '../core/services/team.service';
import { SeasonService } from '../core/services/season.service';
import { ImageService } from '../../core/services/image.service';

interface Team {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  leagueId: number;
  activeSeasonId?: number;
}

interface Season {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface PlayerTeam {
  id: number;
  position: string;
  isPlaying: boolean;
  joinedDate: string;
  teamId: number;
  playerId: number;
  seasonId: number;
  team?: Team;
  season?: Season;
}

interface Player {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  cellNo?: string;
  image?: string;
}

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class PlayerFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  playerId?: number;
  loading = false;
  error = '';
  selectedFile?: File;
  selectedFilePreview?: string;
  currentImageUrl?: string;
  
  // Validation error messages
  firstNameErrorMessage: string | null = null;
  lastNameErrorMessage: string | null = null;
  
  // Data for dropdowns
  teams: Team[] = [];
  seasons: Season[] = [];
  playerTeams: PlayerTeam[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService,
    private teamService: TeamService,
    private seasonService: SeasonService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadInitialData();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.playerId = +idParam;
      this.loadPlayer(this.playerId);
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      cellNo: [''],
      // Team assignment fields
      teamId: [''],
      position: [''],
      seasonId: [''],
      isPlaying: [true]
    });

    // Watch teamId changes to show/hide team-related fields
    this.form.get('teamId')?.valueChanges.subscribe(teamId => {
      if (teamId) {
        // Set default season to active season if available
        const selectedTeam = this.teams.find(t => t.id == teamId);
        if (selectedTeam?.activeSeasonId) {
          this.form.patchValue({ seasonId: selectedTeam.activeSeasonId });
        }
      } else {
        // Clear team-related fields when no team selected
        this.form.patchValue({
          position: '',
          seasonId: '',
          isPlaying: true
        });
      }
    });
  }

  private loadInitialData(): void {
    forkJoin({
      teams: this.teamService.getAll(),
      seasons: this.seasonService.list()
    }).subscribe({
      next: (data) => {
        this.teams = data.teams;
        this.seasons = data.seasons;
      },
      error: (err) => {
        console.error('Error loading initial data:', err);
        this.error = 'Greska pri dobavljanju informacija o timovima i sezoni';
      }
    });
  }

  loadPlayer(id: number): void {
    this.loading = true;
    forkJoin({
      player: this.playerService.getById(id),
      playerTeams: this.playerService.getPlayerTeamByPlayerId(id)
    }).subscribe({
      next: (data) => {
        const player = data.player;
        this.playerTeams = data.playerTeams;
        
        // Format date for HTML input (YYYY-MM-DD)
        const birthDate = player.birthDate ? 
          new Date(player.birthDate).toISOString().split('T')[0] : '';
        
        this.form.patchValue({
          firstName: player.firstName,
          lastName: player.lastName,
          birthDate: birthDate,
          cellNo: player.cellNo || ''
        });

        if (player.image) {
          this.currentImageUrl = this.getImageUrl(player.image);
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading player:', err);
        this.error = 'Greska pri dobavljanju podataka o igracu.';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
    
    // Create a new FileReader instance
    const reader = new FileReader();
    
    // Set up the onload event handler
    reader.onload = (e: any) => {
      // Store the result (data URL) in selectedFilePreview
      this.selectedFilePreview = e.target.result;
    };
    
    // Start reading the file as data URL
    reader.readAsDataURL(file);
    }
  }
    
  removeSelectedFile(): void {
    this.selectedFile = undefined;
    this.selectedFilePreview = undefined;
    
    // Clear the file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  getImageUrl(imageName: string): string {
      var imageUrl = this.imageService.getImageUrl("Players", imageName)  
      return imageUrl;
  }

  togglePlayerTeamStatus(playerTeamId: number, newStatus: boolean): void {
    this.loading = true;
    this.playerService.updatePlayingStatus(playerTeamId, newStatus).subscribe({
      next: () => {
        // Update local data
        const pt = this.playerTeams.find(pt => pt.id === playerTeamId);
        if (pt) {
          pt.isPlaying = newStatus;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error updating player team status:', err);
        this.error = 'Failed to update player team status.';
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.clearValidationErrors();
    
    const formData = new FormData();
    
    // Player basic data
    formData.append('firstName', this.form.value.firstName);
    formData.append('lastName', this.form.value.lastName);
    formData.append('birthDate', this.form.value.birthDate);
    formData.append('cellNo', this.form.value.cellNo || '');
    formData.append('auditUsername', 'admin'); // Replace with actual username
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    // Team assignment data (if team is selected)
    if (this.form.value.teamId) {
      formData.append('teamId', this.form.value.teamId);
      formData.append('position', this.form.value.position || '');
      formData.append('seasonId', this.form.value.seasonId || '');
      formData.append('isPlaying', this.form.value.isPlaying.toString());
    }

    const save$: Observable<any> = this.isEdit
      ? this.playerService.update(this.playerId!, formData)
      : this.playerService.create(formData);

    save$.subscribe({
      next: (res) => {
        if (res.isValid === false && res.errors && res.errors.$values && res.errors.$values.length > 0) {
          this.handleValidationErrors(res.errors.$values);
          this.loading = false;
        } else {
          this.clearValidationErrors();
          this.router.navigate(['/admin/players']);
        }
      },
      error: (err) => {
        console.error('Save error:', err);
        this.error = 'Failed to save player due to network/server error.';
        this.loading = false;
      }
    });
  }

  private handleValidationErrors(errors: any[]): void {
    errors.forEach((error: any) => {
      switch (error.propertyName?.toLowerCase()) {
        case 'firstname':
          this.firstNameErrorMessage = error.message;
          break;
        case 'lastname':
          this.lastNameErrorMessage = error.message;
          break;
        default:
          this.error = error.message || 'Validation error occurred.';
      }
    });
  }

  private clearValidationErrors(): void {
    this.firstNameErrorMessage = null;
    this.lastNameErrorMessage = null;
    this.error = '';
  }
}