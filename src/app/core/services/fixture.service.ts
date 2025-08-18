import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environment';
import { Fixture } from '../models/fixture.model';
import { ApiListResponse } from '../../shared/api-list-response';
import { MatchDay } from '../models/match-day';

@Injectable({
    providedIn: 'root'
})
export class FixtureService {
  private apiUrl = environment.apiUrl + '/fixtures';
    // private apiUrl = environment.mockApiUrl + '/fixture/previewactivematchday';
  
  constructor(private http: HttpClient) {}

  listCurrentRound(seasonId: number): Observable<ApiListResponse<Fixture>> {
      return this.http.get<ApiListResponse<Fixture>>(`${this.apiUrl}/ListCurrentRound/${seasonId}`);
    }
      
        
  listMatchDays(): Observable<ApiListResponse<MatchDay>> {
    return this.http.get<ApiListResponse<MatchDay>>(`${this.apiUrl}/ListMatchDay`);
  }


  listFixturesByMatchDay(matchDayId: number): Observable<ApiListResponse<Fixture>> {
    return this.http.get<ApiListResponse<Fixture>>(`${this.apiUrl}/ListByMatchDay/${matchDayId}`);
  }
}