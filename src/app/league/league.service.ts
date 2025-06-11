import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environment';
import { ApiResponse, League } from '../core/models/league.model';

@Injectable({
    providedIn: 'root'
  })
  export class LeagueService {
    // private apiUrl = environment.apiUrl + '/leagues/list?isActive=true';
    private apiUrl = environment.mockApiUrl + '/leagues/list';
  
    constructor(private http: HttpClient) {}
  
    getLeagues(): Observable<ApiResponse<League>> {
        return this.http.get<ApiResponse<League>>(this.apiUrl);
      }
  }