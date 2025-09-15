import { Routes } from '@angular/router';
import { AdminGuard } from './core/auth/guards/admin.guard';

import { LeagueListComponent } from './admin/league-list/league-list.component';
import { LeagueHomeComponent } from './league-home/league-home.component';
import { LeagueFormComponent } from './admin/league-form/league-form.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminTeamListComponent } from './admin/team-list/team-list.component';
import { AdminPlayerListComponent } from './admin/player-list/player-list.component';
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
import { TeamPlayersComponent } from './admin/team-players/team-players.component';
import { AdminFixtureListComponent } from './admin/fixture-list/fixture-list.component';
import { FixtureListComponent } from './fixture-list/fixture-list.component';
import { FixtureFormComponent } from './admin/fixture-form/fixture-form.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { TeamListComponent } from './team-list/team-list.component';
import { PlayerListComponent } from './player-list/player-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'league-home', pathMatch: 'full' },
  { path: 'Index', redirectTo: 'league-home', pathMatch: 'full' },
  { path: 'Home', redirectTo: 'league-home', pathMatch: 'full' },
  { path: 'league-home', component: LeagueHomeComponent },
  { 
    path: 'players', 
    children: [
      { path: ':id', component: PlayerDetailComponent },
      { path: '', component: PlayerListComponent }
    ]
  },
  { 
    path: 'fixtures', 
    children: [
      { path: ':id', component: FixtureDetailComponent },
      { path: '', component: FixtureListComponent }
    ]
  },
  { 
    path: 'teams', 
    children: [
      { path: ':id', component: TeamDetailComponent },
      { path: '', component: TeamListComponent }
    ]
  },
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
      { path: 'teams', component: AdminTeamListComponent },
      { path: 'teams/edit/:id', component: TeamFormComponent },
      { path: 'teams/create', component: TeamFormComponent },
      { path: 'teams/:teamId/players', component: TeamPlayersComponent },
      // Players
      { path: 'players', component: AdminPlayerListComponent },
      { path: 'players/create', component: PlayerFormComponent },
      { path: 'players/edit/:id', component: PlayerFormComponent },
      // Fixtures
      { path: "seasons/:seasonId/fixtures", component: AdminFixtureListComponent},
      { path: "fixtures/:id", component: FixtureFormComponent}
    ],
    canActivate: [AdminGuard]
  }
];
