import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { Fixture } from '../../../core/models/fixture.model';
import { ApiListResponse } from '../../../shared/api-list-response';
import { CommandResult } from '../models/command-result';
import { GenerateFixturesResponse } from '../models/ApiResponse/Fixture/generate-fixtures-response';
import { GenerateFixturesRequest } from '../models/ApiRequest/generate-fixtures-request';
import { MatchDay } from '../../../core/models/match-day';
import { FixtureFormModel } from '../models/fixture-form';
import { PostFixtureRequestModel } from '../models/ApiRequest/post-fixture-details-request';


@Injectable({ providedIn: 'root' })
export class FixtureService {
  private apiUrl = `${environment.apiUrl}/fixtures`;
  private apiAdminUrl = `${environment.apiUrl}/admin/fixtures`;

  constructor(private http: HttpClient) {}

  getBySeason(id: number): Observable<ApiListResponse<Fixture>> {
    return this.http.get<ApiListResponse<Fixture>>(`${this.apiAdminUrl}/list`);
  }

  getById(id: number): Observable<FixtureFormModel> {
    return this.http.get<FixtureFormModel>(`${this.apiAdminUrl}/${id}`);
  }

  create(formData: FormData): Observable<CommandResult<Fixture>> {
    return this.http.post<CommandResult<Fixture>>(`${this.apiAdminUrl}/post`, formData);
  }

  update(formData: FormData): Observable<void> {
    return this.http.patch<void>(`${this.apiAdminUrl}/patch`, formData);
  }

  getRecentBySeason(id: number, limit: number): Observable<Fixture[]> {
    return this.http.get<Fixture[]>(`${this.apiAdminUrl}/GetBySeason/${id}?limit=${limit}`);
  }

  generateForSeasonWithSchedule(request: GenerateFixturesRequest): Observable<GenerateFixturesResponse> {
    const payload = {
      seasonId: request.seasonId,
      startDate: request.startDate,
      timeSlots: request.timeSlots.map(slot => ({
        dayOfWeek: slot.day, // 0=Sunday, 1=Monday, etc.
        time: slot.time      // HH:mm format
      }))
    };

    return this.http.post<GenerateFixturesResponse>(
      `${this.apiAdminUrl}/GenerateSchedule`, 
      payload
    );
  }
  
  listMatchDays(): Observable<ApiListResponse<MatchDay>> {
    return this.http.get<ApiListResponse<MatchDay>>(`${this.apiUrl}/ListMatchDay`);
  }


  listFixturesByMatchDay(matchDayId: number): Observable<ApiListResponse<Fixture>> {
    return this.http.get<ApiListResponse<Fixture>>(`${this.apiUrl}/ListByMatchDay/${matchDayId}`);
  }

  postFixtureDetails(request: PostFixtureRequestModel): Observable<CommandResult<any>> {
    return this.http.post<CommandResult<any>>(`${this.apiAdminUrl}/postfixturedetails/`, request);
  }
}