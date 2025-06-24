import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuOpen = false;
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
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