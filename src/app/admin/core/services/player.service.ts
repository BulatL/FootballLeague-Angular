import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { Player } from '../models/player'
import { ApiListResponse } from '../../../shared/api-list-response';
import { ApiResponse } from '../../../shared/api-response';


@Injectable({ providedIn: 'root' })
export class PlayerService {
  private apiUrl = `${environment.apiUrl}/player`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiListResponse<Player>> {
    return this.http.get<ApiListResponse<Player>>(`${this.apiUrl}/list`);
  }

  getById(id: number): Observable<ApiResponse<Player>> {
    return this.http.get<ApiResponse<Player>>(`${this.apiUrl}/get`, {
      params: { id: id.toString() }
    });
  }

  create(formData: FormData): Observable<ApiResponse<Player>> {
    return this.http.post<ApiResponse<Player>>(`${this.apiUrl}/post`, formData);
  }

  update(id: number, formData: FormData): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, formData);
  }

  deactivateActiveLeague(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/deactivate-active`, {});
  }
}