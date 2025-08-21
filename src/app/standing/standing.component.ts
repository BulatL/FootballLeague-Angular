import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandingService } from "./standing.service"
import { SeasonStanding } from '../core/models/season-standing.model';
import { SeasonService } from '../core/services/season.service';
import { ImageService } from '../core/services/image.service';


@Component({
  selector: 'app-standing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './standing.component.html',
  styleUrls: ['./standing.component.css']
})
export class StandingComponent implements OnInit {
  seasonStanding: SeasonStanding[] = [];
  seasonId: number | null = 1;

  constructor(private standingService: StandingService, 
              private seasonService: SeasonService, 
              private imageService: ImageService) {}

  ngOnInit(): void {
    this.seasonId = this.seasonService.getSeasonId();
    this.standingService.getStandings(this.seasonId!).subscribe({
      next: (data) => {
        this.seasonStanding = (data as any)['$values'];
      },
      error: (err) => console.error(err)
    });
  }
  
  getImage(fileName: string): string {
    return "https://www.inliga.rs/api/images/Teams/" + fileName;
      // var imageUrl = this.imageService.getImageUrl("Teams", fileName)  
      // return imageUrl;
  }
}