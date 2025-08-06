import { NgModule } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
// Import other icons you need

@NgModule({
  imports: [FontAwesomeModule],
  exports: [FontAwesomeModule]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    // Add all your icons here
    library.addIcons(faInstagram);
  }
}