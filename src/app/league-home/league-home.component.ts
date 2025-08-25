import { Component } from '@angular/core';
import { StandingComponent } from './../standing/standing.component';
import { SeasonLeadersComponent } from './../season-leaders/season-leaders.component';
import { HeroSectionComponent } from "./../hero-section/hero-section.component";
import { FixtureCarouselComponent } from "./../fixture-carousel/fixture-carousel.component";
import { SponsorCarouselComponent } from '../sponsor-carousel/sponsor-carousel.component';
import { DreamTeamComponent } from '../dream-team/dream-team.component';

@Component({
  selector: 'app-league-home',
  imports: [StandingComponent, SeasonLeadersComponent, HeroSectionComponent, FixtureCarouselComponent, SponsorCarouselComponent, DreamTeamComponent],
  templateUrl: './league-home.component.html',
  styleUrl: './league-home.component.css',
  template: `
    <app-standing></app-standing>
    <app-season-leaders></app-season-leaders>
    <app-league></app-league>
    <app-fixture-preview></app-fixture-preview>
    <app-sponsor-carousel></app-sponsor-carousel>
    <app-dream-team></app-dream-team>
  `
})
export class LeagueHomeComponent {

}
