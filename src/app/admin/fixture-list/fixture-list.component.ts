// fixture-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FixtureService } from '../core/services/fixture.service';
import { ImageService } from '../../core/services/image.service';
import { Fixture } from '../../core/models/fixture.model';
import { MatchDay } from '../../core/models/match-day';
import { FixtureTimeModalComponent } from "../fixture-time-modal/fixture-time-modal.component";
import { UpdateFixtureDateTimeRequest } from '../core/models/ApiRequest/update-fixture-datetime-request';

@Component({
  selector: 'app-fixture-list',
  templateUrl: './fixture-list.component.html',
  styleUrls: ['./fixture-list.component.css'],
  imports: [CommonModule, FixtureTimeModalComponent]
})
export class AdminFixtureListComponent implements OnInit {
  matchDays: MatchDay[] = [];
  fixtures: Fixture[] = [];
  selectedMatchDayId: number | null = null;
  
  // Loading states
  isLoadingMatchDays = false;
  isLoadingFixtures = false;

  // Edit fixture time
  showFixtureTimeModal = false;
  selectedFixtureId = 0;
  selectedFixtureDate = new Date();
  modalLoading = false;

  constructor(
    private router: Router,
    private fixtureService: FixtureService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.loadMatchDays();
  }

  loadMatchDays(): void {
    this.isLoadingMatchDays = true;
    this.fixtureService.listMatchDays().subscribe({
      next: (matchDays) => {
          if(matchDays.$values.length > 0)
            this.matchDays = matchDays.$values;
        this.isLoadingMatchDays = false;
        
        // Auto-select first matchday if available
        if (matchDays.$values.length > 0) {
          this.selectMatchDay(matchDays.$values[0].id);
        }
      },
      error: (error) => {
        console.error('Error loading match days:', error);
        this.isLoadingMatchDays = false;
      }
    });
  }

  selectMatchDay(matchDayId: number): void {
    this.selectedMatchDayId = matchDayId;
    this.loadFixtures(matchDayId);
  }

  loadFixtures(matchDayId: number): void {
    this.isLoadingFixtures = true;
    this.fixtureService.listFixturesByMatchDay(matchDayId).subscribe({
      next: (fixtures) => {
          if(fixtures.$values.length > 0)
            this.fixtures = fixtures.$values;
        this.isLoadingFixtures = false;
        this.selectedMatchDayId = matchDayId;
      },
      error: (error) => {
        console.error('Error loading fixtures:', error);
        this.isLoadingFixtures = false;
      }
    });
  }

  getTeamLogo(logoFileName: string): string {
    return this.imageService.getImageUrl('Teams', logoFileName);
  }

  onFixtureClick(fixtureId: number): void {
    this.router.navigate(['/admin/fixtures', fixtureId]);
  }

  isMatchDaySelected(matchDayId: number): boolean {
    return this.selectedMatchDayId === matchDayId;
  }

  getMatchDayDisplayText(matchDay: MatchDay): string {
    const status = matchDay.isFinished ? ' ✓' : '';
    return `Round ${matchDay.roundNumber}${status}`;
  }

  hasFixtures(): boolean {
    return this.fixtures.length > 0;
  }

  getSelectedRoundNumber(): number {
    const selectedMatchDay = this.matchDays.find(md => md.id === this.selectedMatchDayId);
    return selectedMatchDay ? selectedMatchDay.roundNumber : 0;
  }

  openFixtureTimeModal(fixtureId: number, currentDateTime: Date, event?: Event): void {
     if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    this.selectedFixtureId = fixtureId;
    this.selectedFixtureDate = currentDateTime;
    this.showFixtureTimeModal = true;
  }
  
    // Handle the actual fixture generation from modal
  onUpdateFixtureDateTime(request: UpdateFixtureDateTimeRequest): void {
    this.modalLoading = true;
    
    this.fixtureService.patchTime(request.fixtureId, request.dateTime).subscribe({
      next: (response: any) => {
        if (response.isValid) {
          this.showFixtureTimeModal = false;
          this.loadFixtures(this.selectedMatchDayId!);
          alert('Vreme utakmice je uspešno ažurirano!');
        } else {
          // Handle API error
          console.error('API Error:', response.errors);
        }
        this.modalLoading = false;
      },
      error: (err) => {
        console.error('Error generating fixtures:', err);
        let msg = 'Failed to update date.';
        alert(msg);
        this.modalLoading = false;
      }
    });
  }
  
  onCloseModal(): void {
    this.showFixtureTimeModal = false;
    this.modalLoading = false;
  }
}