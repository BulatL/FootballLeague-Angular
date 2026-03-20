// team-players.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../core/services/player.service';
import { TeamService } from '../core/services/team.service';
import { SeasonService } from '../../core/services/season.service';
import { ImageService } from '../../core/services/image.service';
import { AvailablePlayer } from '../core/models/ApiResponse/Player/available-players-response';


export interface TeamPlayer {
  id: number;
  playerName: string;
  image: string;
  position: 'Goalkeeper' | 'Player';
  teamId: number;
  playerId: number;
}
@Component({
  selector: 'app-team-players',
  templateUrl: './team-players.component.html',
  styleUrls: ['./team-players.component.css'],
  imports: [CommonModule, FormsModule]
})
export class TeamPlayersComponent implements OnInit {
  teamId: number = 0;
  teamName: string = '';

  // Current team players
  teamPlayers: TeamPlayer[] = [];

  // Available players to add
  availablePlayers: AvailablePlayer[] = [];
  availableSearch: string = '';

  get filteredAvailablePlayers(): AvailablePlayer[] {
    if (!this.availableSearch) return this.availablePlayers;
    const q = this.availableSearch.toLowerCase();
    return this.availablePlayers.filter(p => p.playerName.toLowerCase().includes(q));
  }

  // Seasons
  seasons: any[] = [];
  selectedSeasonId: number | undefined = undefined;

  // Loading states
  isLoading = false;
  isAddingPlayer = false;
  isRemovingPlayer = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService,
    private teamService: TeamService,
    private seasonService: SeasonService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.teamId = Number(this.route.snapshot.paramMap.get('teamId'));
    this.loadSeasons();
  }

  loadSeasons(): void {
    this.seasonService.getAll().subscribe({
      next: (res: any) => {
        this.seasons = res.$values ?? res;
        if (this.seasons.length > 0) {
          this.selectedSeasonId = this.seasons[this.seasons.length - 1].id;
          this.loadTeamPlayers();
          this.loadAvailablePlayers();
        }
      },
      error: (err: any) => console.error('Error loading seasons:', err)
    });
  }

  get isFirstSeasonSelected(): boolean {
    return this.seasons.length === 0 || this.selectedSeasonId === this.seasons[0].id;
  }

  onSeasonChange(): void {
    this.loadTeamPlayers();
    this.loadAvailablePlayers();
  }

  copyFromPreviousSeason(): void {
    const currentIndex = this.seasons.findIndex(s => s.id === this.selectedSeasonId);
    if (currentIndex <= 0) return;
    const previousSeasonId = this.seasons[currentIndex - 1].id;

    if (!confirm('Da li si siguran da zelis da kopiras iz prethodne sezone?')) return;

    this.teamService.copyPlayersFromSeason(this.teamId, previousSeasonId).subscribe({
      next: () => {
        this.loadTeamPlayers();
        this.loadAvailablePlayers();
      },
      error: (err: any) => console.error('Error copying from previous season:', err)
    });
  }

  loadTeamPlayers(): void {
    this.isLoading = true;
    this.playerService.listPlayerTeamByTeamId(this.teamId, this.selectedSeasonId).subscribe({
      next: (players) => {
        this.teamPlayers = players.$values;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading team players:', error);
        this.isLoading = false;
      }
    });
  }

  loadAvailablePlayers(): void {
    this.playerService.listAvailablePlayers(this.selectedSeasonId!).subscribe({
      next: (players) => {
        if(players.$values.length > 0)
          this.availablePlayers = players.$values;
      },
      error: (error) => {
        console.error('Error loading available players:', error);
      }
    });
  }

  getPlayerImage(fileName: string): string {
    return this.imageService.getImageUrl('Players', fileName);
  }

  onPositionChange(player: TeamPlayer, newPosition: string): void {
    const updatedPlayer = { ...player, position: newPosition as 'Goalkeeper' | 'Player' };
    
    this.playerService.postPlayerTeam(player.playerId, this.teamId, newPosition, true).subscribe({
      next: () => {
        // Update local state
        const index = this.teamPlayers.findIndex(p => p.playerId === player.playerId);
        if (index !== -1) {
          this.teamPlayers[index] = updatedPlayer;
        }
      },
      error: (error) => {
        console.error('Error updating player position:', error);
        // Revert the change in UI if needed
        this.loadTeamPlayers();
      }
    });
  }

  addPlayerToTeam(player: AvailablePlayer, position: string = 'Player'): void {
    this.isAddingPlayer = true;
    
    this.playerService.postPlayerTeam(player.playerId, this.teamId, position, true).subscribe({
      next: () => {
        // Remove from available players
        this.availablePlayers = this.availablePlayers.filter(p => p.playerId !== player.playerId);
        
        // Add to team players
        const newTeamPlayer: TeamPlayer = {
          id: 0,
          playerId: player.playerId,
          playerName: player.playerName,
          image: player.image,
          position: position as 'Goalkeeper' | 'Player',
          teamId: this.teamId
        };
        this.teamPlayers.push(newTeamPlayer);
        
        this.isAddingPlayer = false;
      },
      error: (error) => {
        console.error('Error adding player to team:', error);
        this.isAddingPlayer = false;
      }
    });
  }

  removePlayerFromTeam(player: TeamPlayer): void {
    if (!confirm(`Da li si siguran da zelis da izbacis ${player.playerName} iz tima?`)) {
      return;
    }

    this.isRemovingPlayer = true;
    
    this.playerService.postPlayerTeam(player.playerId, this.teamId, player.position, false).subscribe({
      next: () => {
        // Remove from team players
        this.teamPlayers = this.teamPlayers.filter(p => p.playerId !== player.playerId);
        
        // Add back to available players
        const availablePlayer: AvailablePlayer = {
          playerId: player.playerId,
          playerName: player.playerName,
          image: player.image
        };
        this.availablePlayers.push(availablePlayer);
        
        this.isRemovingPlayer = false;
      },
      error: (error) => {
        console.error('Error removing player from team:', error);
        this.isRemovingPlayer = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/teams']);
  }

  getGoalkeepers(): TeamPlayer[] {
    return this.teamPlayers.filter(p => p.position === 'Goalkeeper');
  }

  getOutfieldPlayers(): TeamPlayer[] {
    return this.teamPlayers.filter(p => p.position === 'Player');
  }
}