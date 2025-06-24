import { Component, OnInit } from '@angular/core';
import { FixturePreviewService } from './fixture-preview.service';
import { Fixture } from '../core/models/fixture.model';
import { ApiListResponse } from '../shared/api-list-response';

@Component({
  selector: 'app-fixture-preview',
  imports: [],
  templateUrl: './fixture-preview.component.html',
  styleUrl: './fixture-preview.component.css'
})
export class FixturePreviewComponent implements OnInit {
  fixtures: Fixture[] = [];
  isLoading = true;

  constructor(private fixtureService: FixturePreviewService){}

  ngOnInit(): void {
    this.loadFixtures();
  }

  loadFixtures(): void{
    this.fixtureService.getFixtures().subscribe({
      next: (response: ApiListResponse<Fixture>) => {
        this.fixtures = response.$values
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading fixtures:', error);
        this.isLoading = false;
      }
    })
  }
}
