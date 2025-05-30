import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { StandingComponent } from './standing/standing.component';
import { LeagueComponent } from './league/league.component';
import { FixturePreviewComponent } from './fixture-preview/fixture-preview.component';
import { SeasonLeadersComponent } from './season-leaders/season-leaders.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, StandingComponent, LeagueComponent, FixturePreviewComponent, SeasonLeadersComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `
    <app-navbar></app-navbar>
    <app-standing></app-standing>
    <app-season-leaders></app-season-leaders>
    <app-league></app-league>
    <app-fixture-preview></app-fixture-preview>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'FootballLeague-Angular';
}
