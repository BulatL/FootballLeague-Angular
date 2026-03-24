// sponsors-carousel.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../core/services/image.service';

export interface Sponsor {
  name: string;
  logo: string;
}

@Component({
  selector: 'app-sponsor-carousel',
  templateUrl: './sponsor-carousel.component.html',
  styleUrls: ['./sponsor-carousel.component.css'],
  imports: [CommonModule]
})
export class SponsorCarouselComponent implements OnInit {
  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    // No need to load from API, using static list
  }

  getSponsorLogo(logoFileName: string): string {
    return this.imageService.getImageUrl('Sponsors', logoFileName);
  }

  trackBySponsorId(index: number, sponsor: Sponsor): string {
    return sponsor.name;
  }

  goToSponsorPage(sponsorName: string): void {
    const urls: Record<string, string> = {
      // 'GirosIn': 'https://www.facebook.com/GirosIN',
      'Helioprogress': 'http://www.helioprogress.com',
      // 'NormaPetrol': 'https://www.normapetrol.rs',
      'Plamen': 'https://www.plamen.rs',
      'Ideal': 'https://www.idealdoo.rs',
      'PROBAG': 'https://pro-bag.net',
      'PROLinePVC': 'https://www.prolinepvc.rs',
      'MetalInZelic': 'https://www.metalinzelic.com',
      'HealthAndFit': 'https://www.healthandfit.shop',
    };

    const url = urls[sponsorName];
    if (url) {
      window.open(url, '_blank');
    }
  }
}