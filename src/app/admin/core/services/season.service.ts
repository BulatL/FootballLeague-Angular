import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservableLike } from 'rxjs';
import { Season } from '../models/season';
import { environment } from '../../../../environment';
import { CommandResult } from '../models/command-result';
import { ApiResponse } from '../../../shared/api-response';
import { GetStatisticsResponse } from '../models/ApiResponse/Season/get-statistics-response';

@Injectable({ providedIn: 'root' })
export class SeasonService { 
  private apiUrl = `${environment.apiUrl}/seasons`;
  private apiAdminUrl = `${environment.apiUrl}/admin/seasons`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  
  list(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/list`);
  }

  getById(id: number): Observable<Season> {
    return this.http.get<Season>(`${this.apiUrl}/${id}`);
  }

  getByLeagueWithPagination(leagueId: number, pageNumber: number = 1, pageSize: number = 5): Observable<any> {
    return this.http.get<any>(`${this.apiAdminUrl}/league/${leagueId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getByLeague(leagueId: number, pageNumber: number = 1, pageSize: number = 5): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/league/${leagueId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  create(formData: FormData): Observable<CommandResult<Season>> {
    return this.http.post<CommandResult<Season>>(`${this.apiAdminUrl}/post`, formData);
  }

  update(formData: FormData): Observable<CommandResult<Season>> {
    return this.http.patch<CommandResult<Season>>(`${this.apiAdminUrl}/"patch"`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiAdminUrl}/${id}`);
  }

  getStatistics(id: number): Observable<GetStatisticsResponse> {
    return this.http.get<GetStatisticsResponse>(`${this.apiAdminUrl}/${id}/GetStatistics`);
  }

  listByLeague(leagueId: number, pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ListByLeagues/${leagueId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
  
  listSeasonTeamsBySeasonId(seasonId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${seasonId}/ListSeasonTeamsBySeasonId/`);
  }

  generateStanding(data: { seasonId: number; }): Observable<any>{
    return this.http.post<any>(`${this.apiAdminUrl}/GenerateStanding/`, data);
  }
}