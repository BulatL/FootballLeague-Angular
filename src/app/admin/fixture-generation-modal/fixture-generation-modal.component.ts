import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenerateFixturesRequest, TimeSlot } from '../core/models/ApiRequest/generate-fixtures-request';

@Component({
  selector: 'fixture-generation-modal',
  templateUrl: './fixture-generation-modal.component.html',
  styleUrls: ['./fixture-generation-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FixtureGenerationModalComponent {
  @Input() isVisible = false;
  @Input() seasonId = 0;
  @Input() teamsCount = 0;
  @Input() loading = false;
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() generateFixtures = new EventEmitter<GenerateFixturesRequest>();

  startDate = '';
  timeSlots: TimeSlot[] = [
    { day: 4, time: '19:00' } // Default: Thursday at 7 PM
  ];

  minDate = '';

  constructor() {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    
    // Set default start date to next week
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    this.startDate = nextWeek.toISOString().split('T')[0];
  }

  trackByIndex(index: number): number {
    return index;
  }

  addTimeSlot(): void {
    this.timeSlots.push({ day: 4, time: '19:00' });
  }

  removeTimeSlot(index: number): void {
    if (this.timeSlots.length > 1) {
      this.timeSlots.splice(index, 1);
    }
  }

  calculateTotalMatches(): number {
    if (this.teamsCount < 2) return 0;
    // Round-robin: each team plays every other team twice (home and away)
    return this.teamsCount * (this.teamsCount - 1);
  }

  calculateRounds(): number {
    if (this.teamsCount < 2) return 0;
    // In round-robin with even teams: (teams - 1) * 2 rounds
    // With odd teams: teams * 2 rounds (some teams get bye weeks)
    return this.teamsCount % 2 === 0 
      ? (this.teamsCount - 1) * 2 
      : this.teamsCount * 2;
  }

  getValidationWarnings(): string[] {
    const warnings: string[] = [];

    if (this.teamsCount < 2) {
      warnings.push('Potrebno je minimum 2 tima za generisanje rasporeda');
    }

    if (this.timeSlots.length === 0) {
      warnings.push('Dodajte barem jedan termin za utakmice');
    }

    // Check for duplicate time slots
    const duplicates = this.timeSlots.filter((slot, index) => 
      this.timeSlots.findIndex(s => s.day === slot.day && s.time === slot.time) !== index
    );
    if (duplicates.length > 0) {
      warnings.push('Postoje duplirani termini - uklonite ih');
    }

    // Check if we have enough slots per round
    const matchesPerRound = Math.floor(this.teamsCount / 2);
    if (this.timeSlots.length < matchesPerRound) {
      warnings.push(`Potrebno je ${matchesPerRound} termina po kolu za ${this.teamsCount} timova`);
    }

    return warnings;
  }

  isFormValid(): boolean {
    return this.startDate !== '' && 
           this.timeSlots.length > 0 && 
           this.timeSlots.every(slot => slot.day !== null && slot.time !== '') &&
           this.getValidationWarnings().length === 0;
  }

  onSubmit(): void {
    if (!this.isFormValid() || this.loading) return;

    const request: GenerateFixturesRequest = {
      seasonId: this.seasonId,
      startDate: this.startDate,
      timeSlots: [...this.timeSlots]
    };

    this.generateFixtures.emit(request);
  }

  close(): void {
    this.closeModal.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    // Check if the clicked element is the overlay itself (not a child)
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      this.close();
    }
  }
}