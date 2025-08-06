import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Season } from '../models/season';
import { environment } from '../../../../environment';

@Injectable({ providedIn: 'root' })
export class SeasonService { 
  private apiUrl = `${environment.apiUrl}/leagues`;
  private apiAdminUrl = `${environment.apiUrl}/admin/leagues`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getById(id: number): Observable<Season> {
    return this.http.get<Season>(`${this.apiUrl}/${id}`);
  }

  getByLeague(leagueId: number, pageNumber: number = 1, pageSize: number = 5): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/league/${leagueId}?page=${pageNumber}&pageSize=${pageSize}`);
  }

  create(season: Partial<Season>): Observable<Season> {
    return this.http.post<Season>(this.apiAdminUrl, season);
  }

  update(id: number, season: Partial<Season>): Observable<Season> {
    return this.http.put<Season>(`${this.apiAdminUrl}/${id}`, season);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiAdminUrl}/${id}`);
  }
}