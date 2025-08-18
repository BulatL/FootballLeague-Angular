import { Injectable } from '@angular/core';
import { environment } from './../../../environment';

@Injectable({
    providedIn: 'root'
  })
  export class ImageService {  
    constructor() {}
  
    getImageUrl(subfolder: string, fileName: string): string {
        return `${environment.apiUrl}/images/${encodeURIComponent(subfolder)}/${encodeURIComponent(fileName)}`;             
    }
}
