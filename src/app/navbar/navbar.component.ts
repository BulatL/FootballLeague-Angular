import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuOpen = false;
  isAuthenticated = false;

  constructor(private el: ElementRef, private renderer: Renderer2, private authService: AuthService) {}
  
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