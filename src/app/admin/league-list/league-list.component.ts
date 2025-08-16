import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { League } from '../core/models/league';
import { LeagueService } from '../core/services/league.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-league-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './league-list.component.html',
  styleUrl: './league-list.component.css'
})
export class LeagueListComponent implements OnInit {
  leagues: League[] = [];
  loading = false;
  error: string = '';

  constructor(private leagueService: LeagueService, private router: Router) {}

  ngOnInit(): void {
    this.loadLeagues();
  }

  loadLeagues(): void {
    this.loading = true;
    this.leagueService.getAll().subscribe({
      next: (data) => {
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

  toggleStatus(id: number): void {
    if (confirm('Da li ste sigurni da želite da deaktivirate/aktivirate ligu?')) {
      var formData = new FormData();
      formData.append('id', id.toString());
      formData.append('auditUsername', 'admin');
      this.leagueService.toggleStatus(formData).subscribe({
        next: () => {
          this.loadLeagues();
        },
        error: () => {
          alert('Greška pri deaktiviranju/aktiviranju lige...');
        }
      });
    }
  }
  viewLeague(id: number): void{ 
    this.router.navigate([`/admin/leagues/${id}`]);
  }
}