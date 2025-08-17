import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SeasonService } from '../core/services/season.service';
import { FixtureService } from '../core/services/fixture.service';
import { Fixture } from '../../core/models/fixture.model';
import { Season } from '../core/models/season';
import { GetStatisticsResponse } from '../core/models/ApiResponse/Season/get-statistics-response';
import { FixtureGenerationModalComponent } from './../fixture-generation-modal/fixture-generation-modal.component';
import { GenerateFixturesRequest } from '../core/models/ApiRequest/generate-fixtures-request';

@Component({
  selector: 'app-season-details',
  templateUrl: './season-details.component.html',
  styleUrls: ['./season-details.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FixtureGenerationModalComponent]
})
export class SeasonDetailsComponent implements OnInit {
  seasonId!: number;
  season?: Season;
  loading = true;
  error = '';
  fixturesGenerated = false;
  isStandingGenerated = false;
  
  // Modal state
  showFixtureModal = false;
  modalLoading = false;
  
  statistics: GetStatisticsResponse = {
    teamsCount: 0,
    fixturesTotal: 0,
    fixturesPlayed: 0,
    roundsTotal: 0,
    fixturesUpcoming: 0,
    roundsCompleted: 0,
    currentRound: 0,
    goalsScored: 0,
    averageGoalsPerMatch: 0
  };
  
  recentMatches: Fixture[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seasonService: SeasonService,
    private fixtureService: FixtureService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.seasonId = +idParam;
      this.loadSeasonDetails();
    } else {
      this.router.navigate(['/admin/seasons']);
    }
  }

  private loadSeasonDetails(): void {
    this.loading = true;
    
    forkJoin({
      season: this.seasonService.getById(this.seasonId),
      statistics: this.seasonService.getStatistics(this.seasonId),
      recentMatches: this.fixtureService.getRecentBySeason(this.seasonId, 5)
    }).subscribe({
      next: (data) => {
        this.season = data.season;
        this.statistics = data.statistics;
        this.recentMatches = data.recentMatches || [];
        this.fixturesGenerated = data.statistics.fixturesTotal > 0;
        this.isStandingGenerated = data.season.isStandingGenerated!;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading season details:', err);
        this.error = 'Failed to load season details.';
        this.loading = false;
      }
    });
  }

  // Updated method to show modal instead of direct generation
  generateFixtures(): void {
    if (this.statistics.teamsCount < 2) {
      alert('Potrebno je minimum 2 tima za generisanje rasporeda.');
      return;
    }

    if (this.fixturesGenerated) {
      const confirmRegenerate = confirm(
        'Raspored je već generisan. Da li želite da ga ponovo kreirate? Ovo će obrisati postojeće utakmice.'
      );
      if (!confirmRegenerate) return;
    }

    this.showFixtureModal = true;
  }

  // Handle the actual fixture generation from modal
  onGenerateFixtures(request: GenerateFixturesRequest): void {
    this.modalLoading = true;
    
    this.fixtureService.generateForSeasonWithSchedule(request).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.fixturesGenerated = true;
          this.showFixtureModal = false;
          this.modalLoading = false;
          this.loadSeasonDetails(); // Refresh data
          
          const message = `Uspešno generisan raspored!
Kreirano je ${response.data?.matchesCount} utakmica u ${response.data?.roundsCount} kola.
Prva utakmica: ${this.formatDate(response.data?.firstMatchDate!)}`;
          
          alert(message);
        } else {
          this.error = response.errors.$values[0].message || 'Failed to generate fixtures.';
          this.modalLoading = false;
        }
      },
      error: (err) => {
        console.error('Error generating fixtures:', err);
        this.error = 'Failed to generate fixtures due to network error.';
        this.modalLoading = false;
      }
    });
  }

  onCloseModal(): void {
    this.showFixtureModal = false;
    this.modalLoading = false;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  generateStandings(): void {
  if (this.isStandingGenerated) return;

  const confirmed = confirm('Da li su svi timovi dodati? Timovi ne mogu da se naknadno ubace!');
  if (!confirmed) return;

  this.loading = true;

    const generateStandingData = {
      seasonId: this.seasonId
    };

  this.seasonService.generateStanding(generateStandingData).subscribe({
    next: (response) => {
      if (response.isValid) {
        this.isStandingGenerated = true;
        this.loadSeasonDetails(); // Refresh data
        console.log(response);
        alert('Tabela je uspešno generisana! Dodato ' + response.data + ' timova.');
      } else {
        this.error = response.erros.$values[0].message || 'Failed to generate standings.';
      }
      this.loading = false;
    },
    error: (err) => {
      console.error('Error generating standings:', err);
      this.error = 'Failed to generate standings due to network error.';
      this.loading = false;
    }
  });
}

  // Navigation methods (optional, since we're using routerLink)
  goToTeams(): void {
    this.router.navigate(['teams'], { relativeTo: this.route });
  }

  goToFixtures(): void {
    this.router.navigate(['fixtures'], { relativeTo: this.route });
  }

  goToStandings(): void {
    this.router.navigate(['standings'], { relativeTo: this.route });
  }
}