import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environment';
import { Fixture } from '../models/fixture.model';
import { ApiListResponse } from '../../shared/api-list-response';

@Injectable({
    providedIn: 'root'
  })
  export class FixtureService {
    // private apiUrl = environment.apiUrl + '/leagues/list?isActive=true';
    private apiUrl = environment.mockApiUrl + '/fixture/previewactivematchday';
  
    constructor(private http: HttpClient) {}
  
    getFixtures(): Observable<ApiListResponse<Fixture>> {
        return this.http.get<ApiListResponse<Fixture>>(this.apiUrl);
      }
  }