import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PlayerService } from '../core/services/player.service';
import { Player } from '../core/models/player';
import { DatePipe, NgIf, NgFor } from '@angular/common';
import { ImageService } from '../../core/services/image.service';

@Component({
  selector: 'app-player-list',
  imports: [NgIf, NgFor, DatePipe, RouterModule],
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit {
  players: Player[] = [];
  loading = false;
  error: string = '';

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
