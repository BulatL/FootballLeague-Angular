import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { League } from '../models/league';
import { ApiListResponse } from '../../../shared/api-list-response';
import { ApiResponse } from '../../../shared/api-response';


@Injectable({ providedIn: 'root' })
export class LeagueService {
  private apiUrl = `${environment.apiUrl}/leagues`;
  private apiAdminUrl = `${environment.apiUrl}/admin/leagues`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiListResponse<League>> {
    return this.http.get<ApiListResponse<League>>(`${this.apiAdminUrl}/list`);
  }

  getById(id: number): Observable<League> {
    return this.http.get<League>(`${this.apiUrl}/get`, {
      params: { id: id.toString() }
    });
  }

  create(formData: FormData): Observable<ApiResponse<League>> {
    return this.http.post<ApiResponse<League>>(`${this.apiAdminUrl}/post`, formData);
  }

  update(id: number, formData: FormData): Observable<void> {
    return this.http.put<void>(`${this.apiAdminUrl}/${id}`, formData);
  }

  deactivateActiveLeague(): Observable<void> {
    return this.http.put<void>(`${this.apiAdminUrl}/deactivate-active`, {});
  }
}