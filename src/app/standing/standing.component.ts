import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandingService } from "./standing.service"
import { SeasonStanding } from './../models/season-standing.model';


@Component({
  selector: 'app-standing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './standing.component.html',
  styleUrls: ['./standing.component.css']
})
export class StandingComponent implements OnInit {
  seasonStanding: SeasonStanding[] = [];

  constructor(private standingService: StandingService) {}

  ngOnInit(): void {
    this.standingService.getStandings(1).subscribe({
      next: (data) => {
        console.log('Fetched standings:', data);
        this.seasonStanding = (data as any)['$values'];
        console.log(this.seasonStanding);
      },
      error: (err) => console.error(err)
    });
  }
}