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
  }

  displayAdmin(){
    return this.authService.isAuthenticated();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Get the nativeElement of the navbar component
    const navbar = this.el.nativeElement.querySelector('#navbar');

    if (window.scrollY > 50) {
      this.renderer.addClass(navbar, 'navbar-scrolled');
    } else {
      this.renderer.removeClass(navbar, 'navbar-scrolled');
    }
  }
}