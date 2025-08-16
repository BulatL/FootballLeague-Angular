import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../models/team';
import { environment } from '../../../../environment';
import { GetStatisticsResponse } from '../models/ApiResponse/Team/get-statistics-response';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
 private apiUrl = `${environment.apiUrl}/teams`;
  private apiAdminUrl = `${environment.apiUrl}/admin/teams`;

  constructor(private http: HttpClient) {}


  listByLeague(leagueId: number): Observable<any> {
    return this.http.get<any>(`${this.apiAdminUrl}/listbyleague/${leagueId}`);
  }

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.apiAdminUrl}/list`);
  }

  getById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiAdminUrl}/${id}`);
  }

  getByLeague(leagueId: number, page: number = 1, pageSize: number = 5): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/league/${leagueId}?page=${page}&pageSize=${pageSize}`);
  }

  create(formData: FormData): Observable<Team> {
    return this.http.post<Team>(`${this.apiAdminUrl}/post`, formData);
  }

  update(formData: FormData): Observable<Team> {
    return this.http.patch<Team>(`${this.apiAdminUrl}/patch`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiAdminUrl}/${id}`);
  }
  
  getStatistics(id: number): Observable<GetStatisticsResponse> {
    return this.http.get<GetStatisticsResponse>(`${this.apiUrl}/${id}/getStatistics`);
  }
}