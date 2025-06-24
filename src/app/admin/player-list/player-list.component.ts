import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../core/services/player.service';
import { Player } from '../core/models/player';
import { AsyncPipe, DatePipe, NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-player-list',
  imports: [NgIf, NgFor, DatePipe],
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit {
  players: Player[] = [];
  loading = false;
  error: string = '';

  constructor(private playerService: PlayerService, private router: Router) {}

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.loading = true;
    this.playerService.getAll().subscribe({
      next: (res) => {
        this.players = res.$values;
        this.loading = false;
      },
      error: () => {
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
}
