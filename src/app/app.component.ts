import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from './core/auth/services/auth.service';
import { User } from './core/models/auth.models';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SharedModule } from './shared/shared.module';



@Component({
  selector: 'app-root',
  imports: [ CommonModule, RouterOutlet, RouterModule, NavbarComponent, FooterComponent, SharedModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `
  <span *ngIf="currentUser">Ulogovan je </span>
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `
})
export class AppComponent implements OnInit {
  title = 'FootballLeague-Angular';
  currentUser: User | null = null;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
}
