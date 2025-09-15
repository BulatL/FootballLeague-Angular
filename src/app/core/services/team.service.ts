import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { TeamDetailModel } from '../models/team-detail-model';
import { TeamFilters } from '../models/team-list-model';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private apiUrl = `${environment.apiUrl}/teams`;

   constructor(private http: HttpClient) {}

  getInfo(id: number): Observable<TeamDetailModel> {
    return this.http.get<TeamDetailModel>(`${this.apiUrl}/${id}`);
  }

  listTeams(filters: TeamFilters): Observable<any>{
    let params = new HttpParams();
    
    if (filters.seasonId > 0) {
      params = params.set('seasonId', filters.seasonId.toString());
    }
    if (filters.searchTerm) {
      params = params.set('search', filters.searchTerm);
    }
    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
      params = params.set('sortDirection', filters.sortDirection);
    }

    return this.http.get<any>(`${this.apiUrl}/filter`, { params });
  }

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/list`);
  }
}