import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../models/team';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class StandingService {
 private apiUrl = `${environment.apiUrl}/teams`;
  private apiAdminUrl = `${environment.apiUrl}/admin/teams`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`);
  }

  getByLeague(leagueId: number, page: number = 1, pageSize: number = 5): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/league/${leagueId}?page=${page}&pageSize=${pageSize}`);
  }

  create(team: Partial<Team>): Observable<Team> {
    return this.http.post<Team>(this.apiAdminUrl, team);
  }

  update(id: number, team: Partial<Team>): Observable<Team> {
    return this.http.put<Team>(`${this.apiAdminUrl}/${id}`, team);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiAdminUrl}/${id}`);
  }
}