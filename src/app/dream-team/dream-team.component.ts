import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule  } from '@angular/router';
import { PlayerService } from '../core/services/player.service';
import { ImageService } from '../core/services/image.service';
import { DreamTeamModel } from '../core/models/dream-team-model';


@Component({
  selector: 'app-dream-team',
  imports: [CommonModule, RouterModule ],
  templateUrl: './dream-team.component.html',
  styleUrl: './dream-team.component.css'
})
export class DreamTeamComponent {
  loading = true;
  error: string | null = null;
  @Input() playerId!: number;
  players!: DreamTeamModel;

  constructor(private playerService: PlayerService,
              private route: ActivatedRoute,
              private imageService: ImageService,
              private router: Router){}


  ngOnInit() {
    this.loading = true;
    this.error = null;
    
    this.playerService.getDreamTeamPlayers().subscribe({
      next: (response: DreamTeamModel) => {
        this.players = response;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load player data';
        this.loading = false;
        console.error('Error loading player:', error);
      }
    });
  }
  
  getPlayerImage(fileName: string): string {
    if(fileName == "")
        return "default-player.png";
    return this.imageService.getImageUrl('Players', fileName);
  }

  onPlayerClick(playerId: number){
    this.router.navigate(['/players/', playerId]);
  }
}