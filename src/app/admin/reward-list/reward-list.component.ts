import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RewardService } from '../core/services/reward.service';
import { environment } from '../../../environment';


@Component({
 selector: 'app-reward-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './reward-list.component.html',
  styleUrl: './reward-list.component.css'
})
export class RewardListComponent implements OnInit {
  rewards: any[] = [];
  loading = true;
  error = '';
  apiBaseUrl = environment.apiUrl

  constructor(private rewardService: RewardService, private router: Router) {}

  ngOnInit(): void {
    this.loadRewards();
  }

  loadRewards(): void {
    this.loading = true;
    this.rewardService.getAll().subscribe({
      next: (data) => {
        console.log(data);
        this.rewards = data.$values;
        this.loading = false;
      },
      error: () => {
        this.error = 'Greska pri ucitavanju nagrada...';
        this.loading = false;
      }
    });
  }

  editRewards(id: number): void {
    this.router.navigate([`/admin/rewards/edit/${id}`]);
  }

  goToCreate(): void {
    this.router.navigate(['/admin/rewards/create']);
  }
  
  getImageUrl(fileName: string): string {
      return `${environment.apiUrl}/images/${encodeURIComponent("Rewards")}/${encodeURIComponent(fileName)}`;    
  }
}