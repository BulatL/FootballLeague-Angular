import { Injectable } from '@angular/core';
import { environment } from './../../../environment';

@Injectable({
    providedIn: 'root'
  })
  export class ImageService {  
    constructor() {}
  
    getImageUrl(subfolder: string, fileName: string): string {
      if(fileName == "" && subfolder == "Teams")
        return "default-team.png";

      else if(fileName == "" && subfolder == "Players")
        return "default-player.png";

      return `${environment.apiUrl}/images/${encodeURIComponent(subfolder)}/${encodeURIComponent(fileName)}`;             
    }
}
