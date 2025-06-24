import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LeagueService } from '../core/services/league.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-league-form',
  templateUrl: './league-form.component.html',
  styleUrls: ['./league-form.component.css'],
  imports: [ ReactiveFormsModule, CommonModule ]
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
    }
  }

  loadLeague(id: number): void {
    this.leagueService.getById(id).subscribe({
      next: (res) => {
        console.log(res);
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
    const formData = new FormData();
    formData.append('name', this.form.value.name);
    formData.append('isActive', this.form.value.isActive);
    formData.append('auditUsername', 'admin');
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const save$: Observable<any> = this.isEdit
      ? this.leagueService.update(this.leagueId!, formData)
      : this.leagueService.create(formData);

    save$.subscribe({
      next: (res) => {
        if (res.isValid === false && res.errors && res.errors.$values && res.errors.$values.length > 0) {
          const nameError = res.errors.$values.find((e: any) => e.propertyName === 'name');
          this.nameErrorMessage = nameError ? nameError.message : null;
          this.loading = false;
        } else {
          this.nameErrorMessage = null; // clear on success
          this.router.navigate(['/admin/leagues']);
        }
      },
      error: () => {
        this.error = 'Failed to save league due to network/server error.';
        this.loading = false;
      }
   });
  }
}
