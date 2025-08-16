import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TeamService } from '../core/services/team.service';
import { Team } from '../core/models/team';
import { ImageService } from '../../core/services/image.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class TeamListComponent implements OnInit {
  teams: Team[] = [];
  paginatedTeams: Team[] = [];
  
  loading = false;
  error = '';
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  constructor(
    private router: Router,
    private teamService: TeamService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  private loadTeams(): void {
    this.loading = true;
    
    this.teamService.getAll().subscribe({
      next: (response) => {
        // Handle API response structure based on your example
        this.teams = response?.$values || [];
        this.updatePagination();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading teams:', err);
        this.error = 'Failed to load teams data.';
        this.loading = false;
      }
    });
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.teams.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTeams = this.teams.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }


  getImage(fileName: string): string {
      var imageUrl = this.imageService.getImageUrl("Teams", fileName)  
      return imageUrl;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/teams/default-team.png';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  goToCreate(): void {
    this.router.navigate(['/admin/teams/create']);
  }

  viewTeam(teamId: number): void {
    this.router.navigate(['/admin/teams', teamId]);
  }

  editTeam(teamId: number): void {
    this.router.navigate(['/admin/teams/edit', teamId]);
  }

  deleteTeam(teamId: number): void {
    const team = this.teams.find(t => t.id === teamId);
    if (!team) return;

    const confirmDelete = confirm(
      `Da li ste sigurni da želite da obrišete tim "${team.fullName}"?\n\n` +
      'Ova akcija će obrisati:\n' +
      '- Sve igrače tima\n' +
      '- Sve utakmice tima\n' +
      '- Sve statistike tima\n\n' +
      'Ova akcija se ne može poništiti!'
    );

    if (confirmDelete) {
      this.loading = true;
      this.teamService.delete(teamId).subscribe({
        next: () => {
          this.teams = this.teams.filter(t => t.id !== teamId);
          this.updatePagination();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error deleting team:', err);
          this.error = 'Failed to delete team. The team might have associated data.';
          this.loading = false;
        }
      });
    }
  }

  // Helper method for tracking in ngFor
  trackByTeamId(index: number, team: Team): number {
    return team.id;
  }
}