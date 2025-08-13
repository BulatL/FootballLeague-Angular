import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { SeasonService } from '../core/services/season.service';
import { LeagueService } from '../core/services/league.service';

interface League {
  id: number;
  name: string;
  image: string;
  isActive: boolean;
}

@Component({
  selector: 'app-season-form',
  templateUrl: './season-form.component.html',
  styleUrls: ['./season-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class SeasonFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  seasonId?: number;
  loading = false;
  error = '';
  leagueId?: number;
  
  // Validation error messages
  nameErrorMessage: string | null = null;
  dateRangeError: string | null = null;
  
  // Data for dropdowns
  leagues: League[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private seasonService: SeasonService,
    private leagueService: LeagueService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    
    // Read route parameters
    this.leagueId = this.route.snapshot.queryParams['leagueId'];
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.seasonId = +idParam;
      this.form.get('endDate')?.disable();
    }

    // Load leagues first, then handle form population
    this.loadLeagues();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      leagueId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''] // Removed Validators.required
    });

    // Add custom validator for date range
    this.form.get('endDate')?.valueChanges.subscribe(() => {
      this.validateDateRange();
    });

    this.form.get('startDate')?.valueChanges.subscribe(() => {
      this.validateDateRange();
    });
  }

  private validateDateRange(): void {
    const startDate = this.form.get('startDate')?.value;
    const endDate = this.form.get('endDate')?.value;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end <= start) {
        this.dateRangeError = 'Datum kraja mora biti posle datuma početka.';
      } else {
        this.dateRangeError = null;
      }
    } else {
      this.dateRangeError = null;
    }
  }

  private loadLeagues(): void {
    this.leagueService.getAll().subscribe({
      next: (response) => {
        // Assuming the response has a $values property or similar structure
        const leagues = response.$values || response;
        this.leagues = leagues.filter((league: League) => league.isActive);
        
        // After leagues are loaded, set the leagueId from query params or load season data
        this.handleInitialData();
      },
      error: (err) => {
        console.error('Error loading leagues:', err);
        this.error = 'Failed to load leagues data.';
      }
    });
  }

  private handleInitialData(): void {
    if (this.isEdit && this.seasonId) {
      // Load existing season data
      this.loadSeason(this.seasonId);
    } else if (this.leagueId) {
      // Set leagueId from query params for new season
      this.form.patchValue({
        leagueId: +this.leagueId // Convert to number to match option values
      });
    }
  }

  loadSeason(id: number): void {
    this.loading = true;
    this.seasonService.getById(id).subscribe({
      next: (season) => {
        // Format dates for HTML input (YYYY-MM-DD)
        const startDate = season.startDate ? 
          new Date(season.startDate).toISOString().split('T')[0] : '';
        const endDate = season.endDate ? 
          new Date(season.endDate).toISOString().split('T')[0] : '';
        
        this.form.patchValue({
          name: season.name,
          leagueId: season.leagueId,
          startDate: startDate,
          endDate: endDate
        });
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading season:', err);
        this.error = 'Failed to load season data.';
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.invalid || this.dateRangeError) return;

    this.loading = true;
    this.clearValidationErrors();
  
    const formData = new FormData();
    formData.append('name', this.form.value.name);
    formData.append('leagueId', this.form.value.leagueId.toString());
    formData.append('startDate', this.form.value.startDate);
    formData.append('endDate', this.form.value.endDate);
    formData.append('auditUsername', 'admin'); // Replace with actual username

    if(this.isEdit)
      formData.append('id', this.seasonId!.toString());

    const save$: Observable<any> = this.isEdit
      ? this.seasonService.update(formData)
      : this.seasonService.create(formData);

    save$.subscribe({
      next: (res) => {
        if (res.isValid === false && res.errors && res.errors.$values && res.errors.$values.length > 0) {
          this.handleValidationErrors(res.errors.$values);
          this.loading = false;
        } else {
          this.clearValidationErrors();
          // Navigate back to the league if leagueId exists, otherwise to seasons list
          if (this.leagueId) {
            this.router.navigate(['/admin/leagues', this.leagueId]);
          } else {
            this.router.navigate(['/admin/seasons']);
          }
        }
      },
      error: (err) => {
        console.error('Save error:', err);
        this.error = 'Failed to save season due to network/server error.';
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
        case 'startdate':
        case 'enddate':
          this.dateRangeError = error.message;
          break;
        default:
          this.error = error.message || 'Validation error occurred.';
      }
    });
  }

  private clearValidationErrors(): void {
    this.nameErrorMessage = null;
    this.dateRangeError = null;
    this.error = '';
  }

  // Helper method to get the correct navigation route
  getBackRoute(): string {
    return this.leagueId ? `/admin/leagues/${this.leagueId}` : `/admin/seasons/${this.seasonId}`;
  }
}