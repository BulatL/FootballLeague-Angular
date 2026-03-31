// user-fixture-list.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixtureService } from '../core/services/fixture.service';
import { ImageService } from '../core/services/image.service';
import { MatchDay } from '../core/models/match-day';
import { Fixture } from '../core/models/fixture.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fixture-list',
  templateUrl: './fixture-list.component.html',
  styleUrls: ['./fixture-list.component.css'],
  imports: [CommonModule]
})
export class FixtureListComponent implements OnInit {
  @ViewChild('roundPicker') roundPickerRef!: ElementRef<HTMLDivElement>;

  matchDays: MatchDay[] = [];
  fixtures: Fixture[] = [];
  selectedMatchDayId: number | null = null;

  // Loading states
  isLoadingMatchDays = false;
  isLoadingFixtures = false;

  // Drag-to-scroll state
  isDragging = false;
  private dragStartX = 0;
  private dragScrollLeft = 0;

  constructor(
    private fixtureService: FixtureService,
    private imageService: ImageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadMatchDays();
  }

  loadMatchDays(): void {
    this.isLoadingMatchDays = true;
    this.fixtureService.listMatchDays().subscribe({
      next: (matchDays) => {
        var currentMatchDay;
          if(matchDays.$values.length > 0)
          {
            this.matchDays = matchDays.$values;
            currentMatchDay = this.matchDays.find(x => x.isCurrent);
            this.isMatchDaySelected(currentMatchDay!.id);
          }
        this.isLoadingMatchDays = false;
        
        // Auto-select first matchday if available
        if (matchDays.$values.length > 0) {
          this.selectMatchDay(currentMatchDay!.id);
        }
      },
      error: (error) => {
        console.error('Error loading match days:', error);
        this.isLoadingMatchDays = false;
      }
    });
  }

  loadFixtures(matchDayId: number): void {
    this.isLoadingFixtures = true;
    this.fixtureService.listFixturesByMatchDay(matchDayId).subscribe({
      next: (fixtures) => {
        if(fixtures.$values.length > 0){
          this.fixtures = fixtures.$values.map(f => ({
            ...f,
            roundNumber: f.roundNumber,
            isFinished: this.isMatchDayFinished(f.matchDayId)
          }));
        }
        
        this.isLoadingFixtures = false;
      },
      error: (error) => {
        console.error('Error loading fixtures:', error);
        this.isLoadingFixtures = false;
      }
    });
  }

selectMatchDay(matchDayId: number): void {
  this.selectedMatchDayId = matchDayId;
  this.loadFixtures(matchDayId);
}

  getTeamLogo(fileName: string): string {
    if(fileName == "")
        return "default-team.png";
    return this.imageService.getImageUrl('Teams', fileName);
  }

  isMatchDaySelected(matchDayId: number): boolean {
    return this.selectedMatchDayId === matchDayId;
  }

  isMatchDayFinished(matchDayId: number): boolean {
    const matchDay = this.matchDays.find(md => md.id === matchDayId);
    return matchDay ? matchDay.isFinished : false;
  }

  isWinningTeam(homeScore: number, awayScore: number, isHome: boolean): boolean {
    if (homeScore === null || awayScore === null) return false;
    if (isHome) return homeScore > awayScore;
    return awayScore > homeScore;
  }

  isLosingTeam(homeScore: number, awayScore: number, isHome: boolean): boolean {
    if (homeScore === null || awayScore === null) return false;
    if (isHome) return homeScore < awayScore;
    return awayScore < homeScore;
  }


  
  onRoundPickerMouseDown(event: MouseEvent): void {
    const el = this.roundPickerRef.nativeElement;
    this.isDragging = true;
    this.dragStartX = event.pageX - el.offsetLeft;
    this.dragScrollLeft = el.scrollLeft;
  }

  onRoundPickerMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
    const el = this.roundPickerRef.nativeElement;
    const x = event.pageX - el.offsetLeft;
    el.scrollLeft = this.dragScrollLeft - (x - this.dragStartX);
  }

  onRoundPickerMouseUp(): void {
    this.isDragging = false;
  }

  onFixtureClick(fixture: Fixture): void {
    const fixtureDate = new Date(fixture.date); // convert string -> Date
    const now = new Date();

    if (fixtureDate < now && (fixture.homeTeamName != null && fixture.awayTeamName != null)) 
      this.router.navigate([`/fixtures/${fixture.id}`]);
  }

  hasFixtures(): boolean {
    return this.fixtures.length > 0;
  }

  onTeamClick(teamId: number, event: Event){
    event.stopPropagation();
    
    if(teamId > 0)
      this.router.navigate(['/teams/', teamId]);
  }
}