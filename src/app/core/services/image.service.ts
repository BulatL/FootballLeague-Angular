import { Injectable } from '@angular/core';
import { environment } from './../../../environment';

@Injectable({
    providedIn: 'root'
  })
  export class ImageService {  
    constructor() {}
  
    getImageUrl(subfolder: string, fileName: string): string {
      if(fileName == "" && subfolder == "Teams")
        fileName = "default-team.png";

      else if(fileName == "" && subfolder == "Players")
        fileName = "default-player.png";

      // return `${environment.apiUrl}/images/${encodeURIComponent(subfolder)}/${encodeURIComponent(fileName)}`;     
      return `uploads/${subfolder}/${encodeURIComponent(fileName)}`;             
    }
}
