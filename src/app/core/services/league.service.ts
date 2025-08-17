import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from './../../../environment';
import { League } from '../models/league.model';
import { ApiListResponse } from '../../shared/api-list-response';
import { ApiResponse } from '../../shared/api-response';

@Injectable({
    providedIn: 'root'
  })
  export class LeagueService {
    private apiUrl = `${environment.apiUrl}/leagues`;
    private leagueIdSubject = new BehaviorSubject<number | null>(null);
    leagueId$ = this.leagueIdSubject.asObservable();

    constructor(private http: HttpClient) {}
  
    setLeagueId(id: number) {
      this.leagueIdSubject.next(id);
    }

    getLeagueId(): number | null {
      return this.leagueIdSubject.value; // synchronous getter
    }


    getLeagues(): Observable<ApiListResponse<League>> {
        return this.http.get<ApiListResponse<League>>(environment.mockApiUrl + '/leagues/list');
      }

    getLeague(): Observable<ApiResponse<League>> {
      return this.http.get<ApiResponse<League>>(environment.mockApiUrl + '/leagues/list');
    }

    getLeageuInfo(): Observable<any>{
      return this.http.get<any>(`${this.apiUrl}/GetInfo`);
    }
  }