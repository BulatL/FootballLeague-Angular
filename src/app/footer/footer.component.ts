import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';


@Component({
  selector: 'app-footer',
  imports: [SharedModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  openInstagram(){
    window.open('https://www.instagram.com/inliga_indjija/', '_blank'); // '_blank' opens in new tab
  }

}
