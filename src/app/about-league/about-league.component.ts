import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-about-league',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-league.component.html',
  styleUrls: ['./about-league.component.css']
})
export class AboutLeagueComponent implements OnInit, OnDestroy {

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    // Override white body background for this dark page
    this.renderer.setStyle(document.body, 'background-color', '#0a1628');
  }

  ngOnDestroy(): void {
    // Restore original body background when leaving this page
    this.renderer.setStyle(document.body, 'background-color', '#f8f9fa');
  }
}