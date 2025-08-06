import { Routes } from '@angular/router';
import { LeagueListComponent } from './admin/league-list/league-list.component';
import { LeagueHomeComponent } from './league-home/league-home.component';
import { LeagueFormComponent } from './admin/league-form/league-form.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { SeasonListComponent } from './admin/season-list/season-list.component';
import { TeamListComponent } from './admin/team-list/team-list.component';
import { PlayerListComponent } from './admin/player-list/player-list.component';
import { RewardListComponent } from './admin/reward-list/reward-list.component';
import { RewardFormComponent } from './admin/reward-form/reward-form.component';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { LeagueInfoComponent } from './admin/league-info/league-info.component';
import { FixtureDetailComponent } from './fixture-detail/fixture-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'league-home', pathMatch: 'full' },
  { path: 'Index', redirectTo: 'league-home', pathMatch: 'full' },
  { path: 'Home', redirectTo: 'league-home', pathMatch: 'full' },
  { path: 'league-home', component: LeagueHomeComponent },
  { path: 'player-detail', component: PlayerDetailComponent },
  { path: 'fixture/:id', component: FixtureDetailComponent },
   {
    path: 'admin',
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'rewards', component: RewardListComponent },
      { path: 'rewards/create', component: RewardFormComponent },
      { path: 'rewards/edit/:id', component: RewardFormComponent },
      { path: 'leagues', component: LeagueListComponent },
      { path: 'leagues/create', component: LeagueFormComponent },
      { path: 'leagues/edit/:id', component: LeagueFormComponent },
      { path: 'leagues/:id', component: LeagueInfoComponent },
      { path: 'seasons', component: SeasonListComponent },
      { path: 'teams', component: TeamListComponent },
      { path: 'players', component: PlayerListComponent },
    ]
  }
];
