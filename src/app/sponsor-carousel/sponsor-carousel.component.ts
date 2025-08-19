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
  
  // Static list of sponsors with image filenames
  sponsors: Sponsor[] = [
    {
      name: 'Sponsor 1',
      logo: 'Sponzor-GirosIn.png',
    },
    {
      name: 'Sponsor 2',
      logo: 'sponsor2.png',
    },
    {
      name: 'Sponsor 3',
      logo: 'sponsor3.png'
    },
    {
      name: 'Sponsor 4',
      logo: 'sponsor4.png',
    },
    {
      name: 'Sponsor 5',
      logo: 'sponsor5.png'
    },
    {
      name: 'Sponsor 6',
      logo: 'sponsor6.png',
    }
  ];

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

}