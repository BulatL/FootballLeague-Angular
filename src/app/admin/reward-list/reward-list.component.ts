import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RewardService } from '../core/services/reward.service';
import { ImageService } from '../../core/services/image.service';

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

  constructor(private rewardService: RewardService, private router: Router, private imageService: ImageService) {}

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
  
  getImage(fileName: string): string {
      var imageUrl = this.imageService.getImageUrl("Rewards", fileName)  
      return imageUrl;
  }
}