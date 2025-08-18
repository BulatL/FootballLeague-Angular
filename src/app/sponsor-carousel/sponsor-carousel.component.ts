// sponsors-carousel.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../core/services/image.service';

export interface Sponsor {
  id: number;
  name: string;
  logo: string;
  website?: string;
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
      id: 1,
      name: 'Sponsor 1',
      logo: 'sponsor1.png',
      website: 'https://example.com'
    },
    {
      id: 2,
      name: 'Sponsor 2',
      logo: 'sponsor2.png',
      website: 'https://example2.com'
    },
    {
      id: 3,
      name: 'Sponsor 3',
      logo: 'sponsor3.png'
    },
    {
      id: 4,
      name: 'Sponsor 4',
      logo: 'sponsor4.png',
      website: 'https://example4.com'
    },
    {
      id: 5,
      name: 'Sponsor 5',
      logo: 'sponsor5.png'
    },
    {
      id: 6,
      name: 'Sponsor 6',
      logo: 'sponsor6.png',
      website: 'https://example6.com'
    }
  ];

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    // No need to load from API, using static list
  }

  getSponsorLogo(logoFileName: string): string {
    return this.imageService.getImageUrl('Sponsors', logoFileName);
  }

  trackBySponsorId(index: number, sponsor: Sponsor): number {
    return sponsor.id;
  }

  onSponsorClick(sponsor: Sponsor): void {
    if (sponsor.website) {
      window.open(sponsor.website, '_blank');
    }
  }
}