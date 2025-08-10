import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../models/team';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class SeasonTeamsService {
  private apiAdminUrl = `${environment.apiUrl}/admin/seasonteams`;

  constructor(private http: HttpClient) {}

  
  getById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiAdminUrl}/${id}`);
  }

  create(team: Partial<Team>): Observable<Team> {
    return this.http.post<Team>(this.apiAdminUrl, team);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiAdminUrl}/${id}`);
  }

  updateSeasonTeams(data: {
    seasonId: number;
    teamsToAdd: number[];
    teamsToRemove: number[];
    }): Observable<any>{
        return this.http.post<any>(`${this.apiAdminUrl}/Update`, data);
    }

    getBySeasonId(seasonId: number, page: number = 1, pageSize: number = 5): Observable<any> {
        return this.http.get<any>(`${this.apiAdminUrl}/league/${seasonId}?page=${page}&pageSize=${pageSize}`);
    }
}