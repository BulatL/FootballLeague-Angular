import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environment';
import { ApiResponse, Fixture } from '../core/models/fixture.model';

@Injectable({
    providedIn: 'root'
  })
  export class FixturePreviewService {
    // private apiUrl = environment.apiUrl + '/leagues/list?isActive=true';
    private apiUrl = environment.mockApiUrl + '/fixture/previewactivematchday';
  
    constructor(private http: HttpClient) {}
  
    getFixtures(): Observable<ApiResponse<Fixture>> {
        return this.http.get<ApiResponse<Fixture>>(this.apiUrl);
      }
  }