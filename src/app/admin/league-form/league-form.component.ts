import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LeagueService } from '../core/services/league.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-league-form',
  templateUrl: './league-form.component.html',
  styleUrls: ['./league-form.component.css'],
  imports: [ ReactiveFormsModule, CommonModule, RouterModule ]
})
export class LeagueFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  leagueId?: number;
  loading = false;
  error = '';
  selectedFile?: File;
  validationErrors: string[] = [];
  nameErrorMessage: string | null = null;
  idErrorMessage: string | null = null;



  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private leagueService: LeagueService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      isActive: [false]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.leagueId = +idParam;
      this.loadLeague(this.leagueId);
      this.form.get('isActive')?.disable();
    }
  }

  loadLeague(id: number): void {
    this.leagueService.getById(id).subscribe({
      next: (res) => {
        const league = res; 
        this.form.patchValue({
          name: res.name,
          isActive: league.isActive
        });
      },
      error: () => (this.error = 'Failed to load league')
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  submit(): void {
    // if (this.form.invalid || (!this.selectedFile && !this.isEdit)) return;

    this.loading = true;
    this.clearValidationErrors(); // Add this to clear previous errors
    
    const formData = new FormData();
    
    // Only append ID if it's an edit operation
    if (this.isEdit && this.leagueId) {
      formData.append('id', this.leagueId.toString());
    }
    
    formData.append('name', this.form.value.name);
    formData.append('isActive', this.form.value.isActive);
    formData.append('auditUsername', 'admin');
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const save$: Observable<any> = this.isEdit
      ? this.leagueService.update(formData)
      : this.leagueService.create(formData);

    save$.subscribe({
      next: (res) => {
        if (res.isValid === false && res.errors && res.errors.$values && res.errors.$values.length > 0) {
          res.errors.$values.forEach((error: any) => {
            switch (error.propertyName?.toLowerCase()) {
              case 'id':
                this.idErrorMessage = error.message;
                break;
              case 'name':
                this.nameErrorMessage = error.message;
                break;
              default:
                this.error = error.message || 'Validation error occurred.';
            }
          });
          this.loading = false; // Add this - you forgot to set loading to false on error
        } else {
          this.clearValidationErrors(); // Use the clear method instead of just nameErrorMessage
          this.router.navigate(['/admin/leagues']);
        }
      },
      error: () => {
        this.error = 'Failed to save league due to network/server error.';
        this.loading = false;
      }
    });
  }

  // And clear it:
  private clearValidationErrors(): void {
    this.idErrorMessage = null;
    this.nameErrorMessage = null;
    this.error = '';
  }
}
