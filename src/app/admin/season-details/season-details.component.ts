import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SeasonService } from '../core/services/season.service';
import { FixtureService } from '../core/services/fixture.service';
import { Fixture } from '../../core/models/fixture.model';
import { Season } from '../core/models/season';
import { GetStatisticsResponse } from '../core/models/ApiResponse/Season/get-statistics-response';


@Component({
  selector: 'app-season-details',
  templateUrl: './season-details.component.html',
  styleUrls: ['./season-details.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SeasonDetailsComponent implements OnInit {
  seasonId!: number;
  season?: Season;
  loading = true;
  error = '';
  fixturesGenerated = false;
  
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
        console.log(data);
        console.log("daaaaaa");
        this.season = data.season;
        this.statistics = data.statistics;
        this.recentMatches = data.recentMatches || [];
        this.fixturesGenerated = data.statistics.fixturesTotal > 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading season details:', err);
        this.error = 'Failed to load season details.';
        this.loading = false;
      }
    });
  }

  generateFixtures(): void {
    if (this.statistics.teamsCount < 2) {
      alert('Potrebno je minimum 2 tima za generisanje rasporeda.');
      return;
    }

    if (this.fixturesGenerated) {
      const confirmRegenerate = confirm('Raspored je već generisan. Da li želite da ga ponovo kreirate? Ovo će obrisati postojeće utakmice.');
      if (!confirmRegenerate) return;
    }

    this.loading = true;
    this.fixtureService.generateForSeason(this.seasonId).subscribe({
      next: (response) => {
        if (response.IsValid) {
          this.fixturesGenerated = true;
          this.loadSeasonDetails(); // Refresh data
          alert(`Uspešno generisan raspored! Kreirano je ${response.Data?.matchesCount} utakmica u ${response.Data?.roundsCount} kola.`);
        } else {
          this.error = response.Erros[0].Message || 'Failed to generate fixtures.';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error generating fixtures:', err);
        this.error = 'Failed to generate fixtures due to network error.';
        this.loading = false;
      }
    });
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

  getLeaderTeam(): string {
    // This would typically come from standings data
    // For now, return a placeholder
    return 'Tabela se učitava...';
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