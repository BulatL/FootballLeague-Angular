import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { PlayerDetailModel } from '../models/player-detail-model';
import { DreamTeamModel } from '../models/dream-team-model';
import { PlayerFilters } from '../models/player-list-model';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private apiUrl = `${environment.apiUrl}/players`;

   constructor(private http: HttpClient) {}

  getInfo(id: number): Observable<PlayerDetailModel> {
    return this.http.get<PlayerDetailModel>(`${this.apiUrl}/${id}`);
  }

  getDreamTeamPlayers(): Observable<DreamTeamModel> {
    return this.http.get<DreamTeamModel>(`${this.apiUrl}/getdreamteamplayers`);
  }

  getByTeam(teamId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetLineupByTeam/${teamId}`);
  }

  listPlayers(filters: PlayerFilters, page: number = 1, pageSize: number = 15): Observable<any>{
    let params = new HttpParams();
    
    if (filters.teamId > 0) {
      params = params.set('teamId', filters.teamId.toString());
    }
    if (filters.position !== 'all') {
      params = params.set('position', filters.position);
    }
    if (filters.searchTerm) {
      params = params.set('search', filters.searchTerm);
    }

    params = params.set('sortBy', filters.sortBy);
    params = params.set('sortDirection', filters.sortDirection);
    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.apiUrl}/filter`, { params });
  }
}