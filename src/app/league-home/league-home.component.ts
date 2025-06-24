import { Component } from '@angular/core';
import { StandingComponent } from './../standing/standing.component';
import { FixturePreviewComponent } from './../fixture-preview/fixture-preview.component';
import { SeasonLeadersComponent } from './../season-leaders/season-leaders.component';
import { HeroSectionComponent } from "./../hero-section/hero-section.component";
import { FixtureCarouselComponent } from "./../fixture-carousel/fixture-carousel.component";

@Component({
  selector: 'app-league-home',
  imports: [StandingComponent, FixturePreviewComponent, SeasonLeadersComponent, HeroSectionComponent, FixtureCarouselComponent],
  templateUrl: './league-home.component.html',
  styleUrl: './league-home.component.css',
  template: `
    <app-standing></app-standing>
    <app-season-leaders></app-season-leaders>
    <app-league></app-league>
    <app-fixture-preview></app-fixture-preview>
  `
})
export class LeagueHomeComponent {

}
