import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpdateFixtureDateTimeRequest } from '../core/models/ApiRequest/update-fixture-datetime-request';

@Component({
  selector: 'app-fixture-time-modal',
  templateUrl: './fixture-time-modal.component.html',
  styleUrl: './fixture-time-modal.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FixtureTimeModalComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() fixtureId = 0;
  @Input() date = new Date();
  @Input() loading = false;
  
  @Output() closeModal = new EventEmitter<void>();  
  @Output() updateFixture = new EventEmitter<UpdateFixtureDateTimeRequest>();


  
  // Separate date and time properties for form inputs
  startDate = '';
  timeSlot = '';
  minDate = '';

  isValid = true;
  error = '';

  constructor() {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.initializeDateAndTime();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // Re-initialize when the input date changes
    if (changes['date'] && changes['date'].currentValue) {
      this.initializeDateAndTime();
    }
  }

   private initializeDateAndTime(): void {
    if (this.date) {
      const inputDate = new Date(this.date);
      
      // Extract date in YYYY-MM-DD format
      this.startDate = inputDate.toISOString().split('T')[0];
      
      // Extract time in HH:mm format (24-hour)
      const hours = inputDate.getHours().toString().padStart(2, '0');
      const minutes = inputDate.getMinutes().toString().padStart(2, '0');
      this.timeSlot = `${hours}:${minutes}`;
    } else {
      // Set default values if no date provided
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      
      this.startDate = nextWeek.toISOString().split('T')[0];
      this.timeSlot = '19:00'; // Default time
    }
  }

  private combineDateAndTime(dateString: string, timeString: string): Date {
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      
      // Validate time values
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        throw new Error('Invalid time format');
      }
      
      // Parse the date string as local date (not UTC)
      const [year, month, day] = dateString.split('-').map(Number);
      
      // Create date object in local timezone
      const dateObj = new Date(year, month - 1, day, hours, minutes, 0, 0);
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date format');
      }
      
      return dateObj;
    } catch (error) {
      console.error('Error combining date and time:', error);
      throw error;
    }
  }

   private validateForm(): boolean {
    this.error = '';
    this.isValid = true;

    // Check if date is provided
    if (!this.startDate) {
      this.error = 'Datum je obavezan.';
      this.isValid = false;
      return false;
    }

    // Check if time is provided
    if (!this.timeSlot) {
      this.error = 'Vreme je obavezno.';
      this.isValid = false;
      return false;
    }

    // Check if date is not in the past (optional validation)
    const selectedDate = new Date(this.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for date comparison
    
    if (selectedDate < today) {
      this.error = 'Datum ne može biti u prošlosti.';
      this.isValid = false;
      return false;
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(this.timeSlot)) {
      this.error = 'Neispravno vreme. Koristite format HH:mm.';
      this.isValid = false;
      return false;
    }

    return true;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    try {
      // Create datetime string exactly as user selected (no timezone conversion)
      const dateTimeString = `${this.startDate}T${this.timeSlot}:00`;

      const request: UpdateFixtureDateTimeRequest = {
        fixtureId: this.fixtureId,
        dateTime: dateTimeString as any // Send as string to avoid timezone conversion
      };

      this.updateFixture.emit(request);
    } catch (error) {
      this.error = 'Greška pri kombinovanju datuma i vremena.';
      this.isValid = false;
    }
  }

  close(): void {
    this.resetForm();
    this.closeModal.emit();
  }

  /**
   * Reset form to initial state
   */
  private resetForm(): void {
    this.error = '';
    this.isValid = true;
    this.initializeDateAndTime();
  }

  onOverlayClick(event: MouseEvent): void {
    // Check if the clicked element is the overlay itself (not a child)
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      this.close();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}