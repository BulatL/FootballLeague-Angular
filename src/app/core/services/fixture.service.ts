import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environment';
import { Fixture } from '../models/fixture.model';
import { ApiListResponse } from '../../shared/api-list-response';
import { MatchDay } from '../models/match-day';
import { FixtureDetailModel } from '../models/fixture-detail-mode';
import { GetFixtureLineupResponse } from '../models/fixture-lineup-response.mode';
import { ApiResponse } from '../../shared/api-response';
import { FixtureTimelineModel } from '../models/fixture-timeline-model';

@Injectable({
    providedIn: 'root'
})
export class FixtureService {
  private apiUrl = environment.apiUrl + '/fixtures';
    // private apiUrl = environment.mockApiUrl + '/fixture/previewactivematchday';
  
  constructor(private http: HttpClient) {}

  get(fixtureId: number): Observable<FixtureDetailModel> {
    return this.http.get<FixtureDetailModel>(`${this.apiUrl}/${fixtureId}`);
  }

  getFixtureLineup(fixtureId: number): Observable<ApiResponse<GetFixtureLineupResponse>> {
    return this.http.get<ApiResponse<GetFixtureLineupResponse>>(`${this.apiUrl}/GetFixtureLineup/${fixtureId}`);
  }

  getFixtureTimeline(fixtureId: number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/GetFixtureTimeline/${fixtureId}`);
  }

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