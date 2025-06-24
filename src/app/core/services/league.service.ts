import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environment';
import { League } from '../models/league.model';
import { ApiListResponse } from '../../shared/api-list-response';
import { ApiResponse } from '../../shared/api-response';

@Injectable({
    providedIn: 'root'
  })
  export class LeagueService {
    // private apiUrl = environment.apiUrl + '/leagues/list?isActive=true';
  
    constructor(private http: HttpClient) {}
  
    getLeagues(): Observable<ApiListResponse<League>> {
        return this.http.get<ApiListResponse<League>>(environment.mockApiUrl + '/leagues/list');
      }

    getLeague(): Observable<ApiResponse<League>> {
      return this.http.get<ApiResponse<League>>(environment.mockApiUrl + '/leagues/list');
    }
  }