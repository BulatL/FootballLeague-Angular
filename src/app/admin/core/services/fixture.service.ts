import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { Fixture } from '../../../core/models/fixture.model';
import { ApiListResponse } from '../../../shared/api-list-response';
import { CommandResult } from '../models/command-result';
import { GenerateFixturesResponse } from '../models/ApiResponse/Fixture/generate-fixtures-response';


@Injectable({ providedIn: 'root' })
export class FixtureService {
  private apiUrl = `${environment.apiUrl}/fixtures`;
  private apiAdminUrl = `${environment.apiUrl}/admin/fixtures`;

  constructor(private http: HttpClient) {}

  getBySeason(id: number): Observable<ApiListResponse<Fixture>> {
    return this.http.get<ApiListResponse<Fixture>>(`${this.apiAdminUrl}/list`);
  }

  getById(id: number): Observable<Fixture> {
    return this.http.get<Fixture>(`${this.apiUrl}/get`, {
      params: { id: id.toString() }
    });
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

  generateForSeason(seasonId: number): Observable<CommandResult<GenerateFixturesResponse>> {
    return this.http.post<CommandResult<GenerateFixturesResponse>>(`${this.apiAdminUrl}/GenerateForSeason`, seasonId);
  }
}