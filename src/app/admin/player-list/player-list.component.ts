import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PlayerService } from '../core/services/player.service';
import { Player } from '../core/models/player';
import { DatePipe, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../core/services/image.service';

@Component({
  selector: 'app-player-list',
  imports: [NgIf, NgFor, DatePipe, RouterModule, FormsModule],
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class AdminPlayerListComponent implements OnInit {
  players: Player[] = [];
  loading = false;
  error: string = '';

  searchName: string = '';
  filterTeam: 'all' | 'with' | 'without' = 'all';

  get filteredPlayers(): Player[] {
    return this.players.filter(p => {
      const name = `${p.firstName} ${p.lastName}`.toLowerCase();
      const matchesName = !this.searchName || name.includes(this.searchName.toLowerCase());
      const matchesTeam =
        this.filterTeam === 'all' ||
        (this.filterTeam === 'with' && p.teamName != null) ||
        (this.filterTeam === 'without' && p.teamName == null);
      return matchesName && matchesTeam;
    });
  }

  constructor(private playerService: PlayerService, private router: Router, private imageService: ImageService) {}

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.loading = true;
    this.playerService.getAll().subscribe({
      next: (res) => {
          if(res.$values.length > 0)
          this.players = res.$values;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Greska pri ucitavanju igraca';
        this.loading = false;
      }
    });
  }

  editPlayer(id: number): void {
    this.router.navigate([`/admin/players/edit/${id}`]);
  }

  goToCreate(): void {
    this.router.navigate(['/admin/players/create']);
  }
  
  getImage(fileName: string): string {
      return this.imageService.getImageUrl("Players", fileName);
  }

  getTeamLogo(fileName: string): string {
      return this.imageService.getImageUrl("Teams", fileName);
  }
}
