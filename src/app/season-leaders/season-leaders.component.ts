import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../admin/core/services/player.service';
import { ImageService } from '../core/services/image.service';
import { SeasonLeaderCategoryData } from '../admin/core/models/season-leader-model';
import { ApiResponse } from '../shared/api-response';
import { AvailablePlayer } from '../admin/core/models/ApiResponse/Player/available-players-response';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-season-leaders',
  imports: [NgFor, CommonModule],
  templateUrl: './season-leaders.component.html',
  styleUrl: './season-leaders.component.css'
})
export class SeasonLeadersComponent implements OnInit {

  constructor(private playerService: PlayerService,
              private imageService: ImageService,
              private cdr: ChangeDetectorRef)
              {}

  category: string = 'goal';
  topPlayer: any = null;
  players: any[] = [];
  error: string | null = null;
  

  ngOnInit(): void {
    this.loadCategoryData();
  }

  selectCategory(category: string): void {
    this.category = category;
    this.loadCategoryData();
  }

  loadCategoryData(): void {
    if(this.category == null)
      this.category = 'goal';
    this.playerService.getTopPlayers(this.category).subscribe({
      next: (response: any) => {
        this.topPlayer = response.topPlayer;
        this.players = response.players.$values;
        this.cdr.detectChanges(); // Force change detection

      },
      error: (error) => {
        this.error = 'Failed to load season leaders';
        console.error('Error loading season leaders:', error);
      }
    });
  }

  hasLeaderData(): boolean {
    return this.topPlayer && this.players && this.players.length > 0;
  }

  getCategoryTitle(): string {
    switch (this.category) {
      case 'goal': return 'Top Strelci';
      case 'assist': return 'Top Asistenti';
      case 'saves': return 'Top Odbrane';
      default: return 'Top Igrači';
    }
  }

  getTopPlayerScore(): number {
    if (!this.topPlayer) return 0;
    switch (this.category) {
      case 'goal': return this.topPlayer.goals || 0;
      case 'assist': return this.topPlayer.assists || 0;
      case 'saves': return this.topPlayer.saves || 0;
      default: return 0;
    }
  }

  getPlayerScore(player: any): number {
    switch (this.category) {
      case 'goal': return player.goals || 0;
      case 'assist': return player.assists || 0;
      case 'saves': return player.saves || 0;
      default: return 0;
    }
  }

  getNoDataMessage(): string {
    switch (this.category) {
      case 'goal': return 'Još uvek nema golova u ovoj sezoni. Sačekajte prve utakmice!';
      case 'assist': return 'Još uvek nema asistencija u ovoj sezoni. Sačekajte prve utakmice!';
      case 'saves': return 'Još uvek nema odbrana u ovoj sezoni. Sačekajte prve utakmice!';
      default: return 'Podaci će biti dostupni nakon prvih utakmica.';
    }
  }

  getPlayerImage(fileName: string): string {
      return this.imageService.getImageUrl("Players", fileName);
  }
}
