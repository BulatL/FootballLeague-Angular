import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environment';
import { League } from '../core/models/league.model';
import { ApiListResponse } from '../shared/api-list-response';

@Injectable({
    providedIn: 'root'
  })
  export class LeagueService {
    // private apiUrl = environment.apiUrl + '/leagues/list?isActive=true';
    private apiUrl = environment.mockApiUrl + '/leagues/list';
  
    constructor(private http: HttpClient) {}
  
    getLeagues(): Observable<ApiListResponse<League>> {
        return this.http.get<ApiListResponse<League>>(this.apiUrl);
      }
  }