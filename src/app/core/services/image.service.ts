import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environment';

@Injectable({
    providedIn: 'root'
  })
  export class ImageService {  
    constructor(private http: HttpClient) {}
  
    getImageUrl(subfolder: string, fileName: string): string {
        return `${environment.apiUrl}/images/${encodeURIComponent(subfolder)}/${encodeURIComponent(fileName)}`;    
        // return this.http.get<ApiListResponse<League>>(environment.mockApiUrl + '/leagues/list');
         
    }
}
