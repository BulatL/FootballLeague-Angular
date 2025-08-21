import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FixtureFormModel } from '../core/models/fixture-form';
import { ImageService } from '../../core/services/image.service';
import { FixtureService } from '../core/services/fixture.service';
import { PlayerService } from '../core/services/player.service';
import { PostFixtureRequestModel } from '../core/models/ApiRequest/post-fixture-details-request';


interface Player {
  playerId: number;
  playerTeamId: number;
  teamId: number;
  playerName: string;
  image: string;
  position: string;
  selectedPosition: string;
  isSelected: boolean;
  saves: number;
}

@Component({
  selector: 'app-fixture-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './fixture-form.component.html',
  styleUrl: './fixture-form.component.css'
})
export class FixtureFormComponent implements OnInit {
  fixtureId?: number;
  fixtureModel: FixtureFormModel = new FixtureFormModel(1, 1, "Team1", "", 0, 2, "Team2", "", 0, new Date(Date.now()));

  homePlayers: Player[] = [];
  awayPlayers: Player[] = [];
  goals: any[] = [];
  penalties: any[] = [];
  cards: any[] = [];
  fixtureStatistic: any;

  // goalkeeper selections
  homeGKId: number | null = null;
  awayGKId: number | null = null;
  homeSaves: number = 0;
  awaySaves: number = 0;
  showOfficialResult: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private imageService: ImageService,
    private fixtureService: FixtureService,
    private playerService: PlayerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // later you’ll fetch these from API
    
    const idParam = this.route.snapshot.paramMap.get('id');
    if(idParam)
    {
      this.fixtureId = +idParam;
      this.loadFixture();
    }
  }

  loadFixture(): void {
    // Populate fixture
    this.fixtureService.getById(this.fixtureId!).subscribe({
      next: (fixture) => {
        this.fixtureModel = new FixtureFormModel(fixture.id,
                                                fixture.homeTeamId,
                                                fixture.homeTeamName,
                                                fixture.homeTeamLogo,
                                                fixture.homeScore,
                                                fixture.awayTeamId,
                                                fixture.awayTeamName,
                                                fixture.awayTeamLogo,
                                                fixture.awayScore,
                                                fixture.fixtureDateTime
        );
        this.loadPlayers();
      },
      error: (error) => {
        console.error('Error loading fixture:', error);
      }
    });

    // Mozda posle da sredim ovo...
    // Initialize stats
    this.fixtureStatistic = {
      homeShots: 0,
      awayShots: 0,
      homeShotsOnTarget: 0,
      awayShotsOnTarget: 0,
      homeSaves: 0,
      awaySaves: 0,
      cornersHome: 0,
      cornersAway: 0,
      foulsHome: 0,
      foulsAway: 0
    };

    // Empty goals/cards
    this.goals = [];
    this.cards = [];
  }

  loadPlayers(): void{
    this.playerService.listPlayerTeamByTeamId(this.fixtureModel.homeTeamId).subscribe({
      next: (homePlayers) => {
          if(homePlayers.$values.length > 0)
            this.homePlayers = homePlayers.$values
          else
            alert(`Nisu pronadjeni igraci ${this.fixtureModel.homeTeamName} tima!`);
      },
      error: (error) => {
        console.error('Error loading homeplayers:', error);
      }
    });
    
    this.playerService.listPlayerTeamByTeamId(this.fixtureModel.awayTeamId).subscribe({
      next: (awayPlayers) => {
          if(awayPlayers.$values.length > 0)
            this.awayPlayers = awayPlayers.$values
          else
            alert(`Nisu pronadjeni igraci ${this.fixtureModel.awayTeamName} tima!`);
      },
      error: (error) => {
        console.error('Error loading awayPlayers:', error);
      }
    });
  }

  saveFixture() {
    const confirmed = confirm("Da li si siguran da zelis da sacuvas?");
    if (!confirmed) {
      return; // User canceled, do nothing
    }
    var allPlayers = [...this.homePlayers, ...this.awayPlayers];

    const request: PostFixtureRequestModel = {
      fixtureId: this.fixtureModel.id,
      homeTeamId: this.fixtureModel.homeTeamId,
      awayTeamId: this.fixtureModel.awayTeamId,
      homeScore: this.fixtureModel.homeScore,
      awayScore: this.fixtureModel.awayScore,
      HomeShootsOnTarget: this.fixtureStatistic.homeShotsOnTarget,
      AwayShootsOnTarget: this.fixtureStatistic.awayShotsOnTarget,
      HomeTotalShoots:  this.fixtureStatistic.homeShots,
      AwayTotalShoots: this.fixtureStatistic.awayShots,
      savesByHomeTeam:  this.fixtureStatistic.homeSaves,
      savesByAwayTeam:  this.fixtureStatistic.awaySaves,
      homeTeamCorners:  this.fixtureStatistic.homeCorners,
      awayTeamCorners:  this.fixtureStatistic.awayCorners,
      homeTeamFouls:  this.fixtureStatistic.homeFouls,
      awayTeamFouls:  this.fixtureStatistic.awayFouls,
      homeSaves: this.homeSaves,
      awaySaves: this.awaySaves,

      // statistics per player - use this.allPlayers instead of allPlayers
      playerStatistics: allPlayers.map((alp: Player) => ({
        playerTeamId: alp.playerTeamId,
        position: alp.selectedPosition || alp.position,
        isPlaying: alp.isSelected,
        saves: alp.saves,
        teamId: alp.teamId
      })),

      // goals - fix the mapping and missing comma
      goals: this.goals.map((g: any) => ({
        playerTeamId: g.playerTeamId,
        minuteScored: g.minuteScored, // Fixed typo: was minutScored
        goalType: g.type, // Add missing type property
        assistPlayerTeamId: g.assistPlayerTeamId == "" ? null : g.assistPlayerTeamId // Added missing comma above
      })),

      playerCards: this.cards.map((crd: any) => ({
        playerTeamId: crd.playerTeamId,
        cardType: crd.cardType,
        minuteGiven: crd.minuteGiven,
      })),
    };

    this.fixtureService.postFixtureDetails(request).subscribe({
      next: (res) => {
        alert('Fixture saved successfully!');
      },
      error: (err) => {
        alert('Error while saving fixture!');
        console.error('Save fixture error:', err);
      }
    });
  }

  updatePosition(player: Player, newPos: string): void {
    player.selectedPosition = newPos;
    // if already selected → update selected list automatically
    // if you want to enforce "must be selected first", add check here
  }

  // add goal event
  addGoal(team: 'home' | 'away', teamId: number) {
    this.goals.push({
      team,          
      teamId,
      playerTeamId: null,
      assistPlayerTeamId: null,
      type: 'goal', // default
      savedById: null
    });

    // update live score
    // this.updateScore();
  }

  // remove goal
  removeGoal(index: number) {
    this.goals.splice(index, 1);
    this.updateScore();
  }

  addPenalty(team: 'home' | 'away', playerId: number, scored: boolean) {
    const goalkeeper = team === 'home' ? this.getAwayGoalkeeper() : this.getHomeGoalkeeper();

    const penalty = {
      team,
      playerId,
      scored,
      savedBy: !scored ? goalkeeper?.playerTeamId : null
    };

    this.penalties.push(penalty);

    // update score
    if (scored) {
      if (team === 'home') {
        this.fixtureModel.homeScore++;
      } else {
        this.fixtureModel.awayScore++;
      }
    }
  }


  // recalc score based on goals array
  updateScore() {
    const homeGoals = this.goals.filter(g =>
      // normal home goal
      (g.team === 'home' && (g.type === 'goal' || g.type === 'free_kick' || g.type === 'penalty_scored')) ||
      // away own goal counts for home
      (g.team === 'away' && g.type === 'own_goal')
    ).length;

    const awayGoals = this.goals.filter(g =>
      // normal away goal
      (g.team === 'away' && (g.type === 'goal' || g.type === 'free_kick' || g.type === 'penalty_scored')) ||
      // home own goal counts for away
      (g.team === 'home' && g.type === 'own_goal')
    ).length;

    this.fixtureModel.homeScore = homeGoals;
    this.fixtureModel.awayScore = awayGoals;
  }

  addCard(team: 'home' | 'away') {
    this.cards.push({
      team,
      playerId: null,
      type: 'yellow', // default
      minute: null
    });
  }

  removeCard(index: number) {
    this.cards.splice(index, 1);
    this.updateScore();
  }


  // Filter helper
  getHomeGoalkeeper() {
    return this.homePlayers.find(p => p.selectedPosition === 'Goalkeeper');
  }

  getAwayGoalkeeper() {
    return this.awayPlayers.find(p => p.selectedPosition === 'Goalkeeper');
  }
  
  getPlayingPlayers(isHomeTeam: boolean) {
    if(isHomeTeam === true)
      return this.homePlayers.filter(x => x.isSelected);
    else 
      return this.awayPlayers.filter(x => x.isSelected);
  }

  get yellowCardsHome() {
    return this.cards.filter(c => c.team === 'home' && c.type === 'yellow').length;
  }

  get yellowCardsAway() {
    return this.cards.filter(c => c.team === 'away' && c.type === 'yellow').length;
  }

  get redCardsHome() {
    return this.cards.filter(c =>
      c.team === 'home' &&
      (c.type === 'red' || c.type === 'second_yellow' || c.type === 'dangerous_foul')
    ).length;
  }

  get redCardsAway() {
    return this.cards.filter(c =>
      c.team === 'away' &&
      (c.type === 'red' || c.type === 'second_yellow' || c.type === 'dangerous_foul')
    ).length;
  }


  getPlayerImage(fileName: string): string {
      return this.imageService.getImageUrl("Players", fileName);
  }

  getTeamLogo(fileName: string): string {
      return this.imageService.getImageUrl("Teams", fileName);
  }

  togglePlayer(player: Player, event: Event): void {
    // Prevent toggling if dropdown was clicked
    if ((event.target as HTMLElement).tagName.toLowerCase() === 'select') {
      return;
    }
    player.isSelected = !player.isSelected;
  }

  toggleOfficialResult(): void {
    this.showOfficialResult = !this.showOfficialResult;
  }

  getMatchResult(): string {
    const homeScore = this.fixtureModel.homeScore || 0;
    const awayScore = this.fixtureModel.awayScore || 0;
    
    if (homeScore > awayScore) {
      return `Pobedio je ${this.fixtureModel.homeTeamName}`;
    } else if (awayScore > homeScore) {
      return `Pobedio je ${this.fixtureModel.awayTeamName}`;
    } else {
      return 'Nerešeno';
    }
  }

  getResultClass(): string {
    const homeScore = this.fixtureModel.homeScore || 0;
    const awayScore = this.fixtureModel.awayScore || 0;
    
    if (homeScore > awayScore) {
      return 'home-win';
    } else if (awayScore > homeScore) {
      return 'away-win';
    } else {
      return 'draw';
    }
  }
  submitOfficialResult(winingTeamId: number, teamName: string){
    if (confirm('Da li ste sigurni da želite da dodelite službeni rezultat timu: ' + teamName)){
      this.fixtureService.postOfficialResult(winingTeamId, this.fixtureId!).subscribe({
        next: (response: any) => {
            if(response.isValid){
              alert("Sluzbeni rezultat uspesno sacuvan");
              this.router.navigate([`/admin/seasons/${response.data}/fixtures`]); 
            }
            else
              alert("Doslo je do greske prilikom cuvanja sluzbenog rezultata: " + response.errors.$values[0])
        },
        error: (error) => {
          console.error('Error saving official result:', error);
        }
      });
    }
    
  }
}