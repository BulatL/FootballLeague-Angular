import { Component, ElementRef, Renderer2, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/auth/services/auth.service';
import { PlayoffService } from '../core/services/playoff.service';
import { SeasonService } from '../core/services/season.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  isAuthenticated = false;
  hasPlayoffStarted = false;

  constructor(private el: ElementRef,
              private renderer: Renderer2,
              private authService: AuthService,
              private playOffService: PlayoffService,
              private seasonService: SeasonService) {}

  ngOnInit() {
    const seasonId = this.seasonService.getSeasonId();
    this.playOffService.hasPlayoffStarted(seasonId!).subscribe(started => {
      this.hasPlayoffStarted = started;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    // Prevent body scroll when menu is open
    if (this.isMenuOpen) {
      this.renderer.addClass(document.body, 'menu-open');
    } else {
      this.renderer.removeClass(document.body, 'menu-open');
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.renderer.removeClass(document.body, 'menu-open');
  }

  displayAdmin(){
    return this.authService.isAuthenticated();
  }
}
