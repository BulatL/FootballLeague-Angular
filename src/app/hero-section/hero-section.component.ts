import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeagueService } from "../core/services/league.service";
import { SeasonService } from '../core/services/season.service';

@Component({
  selector: 'app-hero-section',
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css'
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  images = [
    { src: 'teren.jpg', thumb: 'teren.jpg' },
  ];
  activeIndex = 0;
  intervalId: any;
  loading = true;
  
  leagueId: number = 0;
  leagueName: string = "";
  activeTeams: number = 0; 
  activePlayers: number = 0
  totalPlayers: number = 0;
  seasonsPlayed: number = 0;
  currentSeason: string = "";

  constructor(private leagueService: LeagueService, private seasonService: SeasonService) {}

  ngOnInit() {
    this.getLeagueInfo();
    this.startCarousel();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  setActive(index: number) {
    this.activeIndex = index;
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % this.images.length;
    }, 5000); // rotates every 5 seconds
  }

  getLeagueInfo(){
    this.loading = true;
    this.leagueService.getLeageuInfo().subscribe({
      next: (data) => {
        this.leagueService.setLeagueId(data.id);
        this.seasonService.setSeasonId(data.currentSeason.id);
        this.leagueId = data.id;
        this.currentSeason = data.currentSeason.name;

        this.leagueName = data.name;
        this.seasonsPlayed = data.seasonsPlayed;
        this.activeTeams = data.activeTeams;
        this.activePlayers = data.activePlayers;
        this.loading = false;
      },
      error: () => {
        // this.error = 'Greska pri ucitavanju nagrada...';
        this.loading = false;
      }
    });
  }
}