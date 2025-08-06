import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeagueService } from "../core/services/league.service";
import { League } from '../core/models/league.model';
import { ApiListResponse } from '../shared/api-list-response';

@Component({
  selector: 'app-hero-section',
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css'
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  images = [
    { src: 'ChatGPT Image Jun 6, 2025, 08_04_17 PM.png', thumb: 'ChatGPT Image Jun 6, 2025, 08_04_17 PM.png' },
    { src: 'teren.jpg', thumb: 'teren.jpg' },
    { src: 'teren2.jpg', thumb: 'teren2.jpg' },
    { src: 'IMG-20250801-WA0002.jpg', thumb: 'teren2.jpg' },
    { src: 'IMG-20250801-WA0003.jpg', thumb: 'teren2.jpg' },
    { src: 'IMG-20250801-WA0004.jpg', thumb: 'teren2.jpg' },
    { src: 'IMG-20250801-WA0005.jpg', thumb: 'teren2.jpg' },
    { src: 'IMG-20250801-WA0006.jpg', thumb: 'teren2.jpg' },
    { src: 'IMG-20250801-WA0007.jpg', thumb: 'teren2.jpg' },
    { src: 'IMG-20250801-WA0008.jpg', thumb: 'teren2.jpg' },
    { src: 'IMG-20250801-WA0009.jpg', thumb: 'teren2.jpg' },
    { src: 'IMG-20250801-WA00010.jpg', thumb: 'teren2.jpg' },
    { src: 'IMG-20250801-WA00011.jpg', thumb: 'teren2.jpg' }
  ];
  activeIndex = 0;
  intervalId: any;
  leagueName = 'InLiga Mini Football League';
  activeTeams = 12;
  totalPlayers = 102;
  seasonsPlayed = 5;
  currentSeason = 'Spring 2025';

  ngOnInit() {
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
}