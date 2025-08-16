import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { AdminGuard } from './core/auth/guards/admin.guard';

import { LeagueListComponent } from './admin/league-list/league-list.component';
import { LeagueHomeComponent } from './league-home/league-home.component';
import { LeagueFormComponent } from './admin/league-form/league-form.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { TeamListComponent } from './admin/team-list/team-list.component';
import { PlayerListComponent } from './admin/player-list/player-list.component';
import { RewardListComponent } from './admin/reward-list/reward-list.component';
import { RewardFormComponent } from './admin/reward-form/reward-form.component';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { LeagueInfoComponent } from './admin/league-info/league-info.component';
import { FixtureDetailComponent } from './fixture-detail/fixture-detail.component';
import { PlayerFormComponent } from './admin/player-form/player-form.component';
import { SeasonFormComponent } from './admin/season-form/season-form.component';
import { SeasonDetailsComponent } from './admin/season-details/season-details.component';
import { TeamFormComponent } from './admin/team-form/team-form.component';
import { SeasonTeamsComponent } from './admin/season-teams/season-teams.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'league-home', pathMatch: 'full' },
  { path: 'Index', redirectTo: 'league-home', pathMatch: 'full' },
  { path: 'Home', redirectTo: 'league-home', pathMatch: 'full' },
  { path: 'league-home', component: LeagueHomeComponent },
  { path: 'player-detail', component: PlayerDetailComponent },
  { path: 'fixture/:id', component: FixtureDetailComponent },
  { path: 'login', component: LoginComponent },
   {
    path: 'admin',
    children: [
      { path: '', component: AdminDashboardComponent },
      // Rewards
      { path: 'rewards', component: RewardListComponent },
      { path: 'rewards/create', component: RewardFormComponent },
      { path: 'rewards/edit/:id', component: RewardFormComponent },
      // Leagues
      { path: 'leagues', component: LeagueListComponent },
      { path: 'leagues/create', component: LeagueFormComponent },
      { path: 'leagues/edit/:id', component: LeagueFormComponent },
      { path: 'leagues/:id', component: LeagueInfoComponent },
      // Seasons
      { path: 'seasons/create', component: SeasonFormComponent },
      { path: 'seasons/edit/:id', component: SeasonFormComponent },
      { path: 'seasons/:id', component: SeasonDetailsComponent },
      { path: 'seasons/:seasonId/teams', component: SeasonTeamsComponent },
      // Teams
      { path: 'teams', component: TeamListComponent },
      { path: 'teams/edit/:id', component: TeamFormComponent },
      { path: 'teams/create', component: TeamFormComponent },
      // Players
      { path: 'players', component: PlayerListComponent },
      { path: 'players/create', component: PlayerFormComponent },
      { path: 'players/edit/:id', component: PlayerFormComponent },
    ],
    canActivate: [AdminGuard]
  }
];
