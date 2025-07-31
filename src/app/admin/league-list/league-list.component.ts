import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { League } from '../core/models/league';
import { LeagueService } from '../core/services/league.service';
import { Router } from '@angular/router';
import { environment } from '../../../environment';
import { ImageService } from '../../core/services/image.service';

@Component({
  selector: 'app-league-list',
  imports: [CommonModule],
  templateUrl: './league-list.component.html',
  styleUrl: './league-list.component.css'
})
export class LeagueListComponent implements OnInit {
  leagues: League[] = [];
  loading = false;
  error: string = '';

  constructor(private leagueService: LeagueService, private router: Router, private imageService: ImageService) {}

  ngOnInit(): void {
    this.loadLeagues();
  }

  loadLeagues(): void {
    this.loading = true;
    this.leagueService.getAll().subscribe({
      next: (data) => {
        console.log(data);
        this.leagues = data.$values;
        this.loading = false;
      },
      error: () => {
        this.error = 'Greska pri ucitavanju liga...';
        this.loading = false;
      }
    });
  }

  editLeague(id: number): void {
    this.router.navigate([`/admin/leagues/edit/${id}`]);
  }

  goToCreate(): void {
    this.router.navigate(['/admin/leagues/create']);
  }
  
  getImage(fileName: string): string {
      return this.imageService.getImageUrl("Leagues", fileName)  
  }
  viewLeague(id: number): void{ 
    this.router.navigate([`/admin/leagues/${id}`]);
  }
}