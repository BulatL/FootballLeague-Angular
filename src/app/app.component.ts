import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SharedModule } from './shared/shared.module';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, SharedModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `
})
export class AppComponent {
  title = 'FootballLeague-Angular';
}
