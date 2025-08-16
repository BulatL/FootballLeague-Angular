import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { RewardService } from '../core/services/reward.service';

@Component({
  selector: 'app-reward-form',
  templateUrl: './reward-form.component.html',
  styleUrls: ['./reward-form.component.css'],
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, RouterModule ]
})
export class RewardFormComponent {
   form!: FormGroup;
  isEdit = false;
  rewardId?: number;
  loading = false;
  error = '';
  selectedFile?: File;
  validationErrors: string[] = [];
  nameErrorMessage: string | null = null;

   constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private rewardService: RewardService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      isForPlayer: [false]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.rewardId = +idParam;
      this.loadReward(this.rewardId);
    }
  }

  loadReward(id: number): void {
    this.rewardService.getById(id).subscribe({
      next: (res) => {
        const reward = res; 
        this.form.patchValue({
          name: res.name,
          isForPlayer: reward.isForPlayer
        });
      },
      error: (err) => (console.log(err), this.error = 'Failed to load reward')
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const formData = new FormData();
    formData.append('name', this.form.value.name);
    formData.append('isForPlayer', this.form.value.isForPlayer);
    formData.append('auditUsername', 'admin');
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const save$: Observable<any> = this.isEdit
      ? this.rewardService.update(this.rewardId!, formData)
      : this.rewardService.create(formData);

    save$.subscribe({
      next: (res) => {
        if (res.isValid === false && res.errors && res.errors.$values && res.errors.$values.length > 0) {
          const nameError = res.errors.$values.find((e: any) => e.propertyName === 'name');
          this.nameErrorMessage = nameError ? nameError.message : null;
          this.loading = false;
        } else {
          this.nameErrorMessage = null; // clear on success
          this.router.navigate(['/admin/rewards']);
        }
      },
      error: () => {
        this.error = 'Failed to save award due to network/server error.';
        this.loading = false;
      }
   });
  }
}