import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeagueService } from "./league.service";
import { ApiResponse, League } from './../models/league.model';

@Component({
  selector: 'app-league',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './league.component.html',
  styleUrl: './league.component.css'
})

export class LeagueComponent implements OnInit {
  leagues: League[] = [];
  isLoading = true;

  constructor(private leagueService: LeagueService) {}

  ngOnInit(): void {
    this.loadLeagues();
  }

  loadLeagues(): void {
    this.leagueService.getLeagues().subscribe({
      next: (response: ApiResponse<League>) => {
        console.log(response);
        this.leagues = response.$values;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading leagues:', error);
        this.isLoading = false;
      }
    });
  }
}