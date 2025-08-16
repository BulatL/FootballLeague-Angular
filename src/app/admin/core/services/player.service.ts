import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { Player } from '../models/player'
import { ApiListResponse } from '../../../shared/api-list-response';
import { ApiResponse } from '../../../shared/api-response';
import { CommandResult } from '../models/command-result';


@Injectable({ providedIn: 'root' })
export class PlayerService {
  private apiUrl = `${environment.apiUrl}/players`;
  private adminApiUrl = `${environment.apiUrl}/admin/players`;

   constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.adminApiUrl}/list`);
  }

  getById(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.adminApiUrl}/${id}`);
  }

  getByLeague(leagueId: number, page: number = 1, pageSize: number = 5): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/league/${leagueId}?page=${page}&pageSize=${pageSize}`);
  }

  getByTeam(teamId: number, page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/team/${teamId}?page=${page}&pageSize=${pageSize}`);
  }
  
  create(formData: FormData): Observable<CommandResult<Player>> {
    return this.http.post<CommandResult<Player>>(`${this.adminApiUrl}/post`, formData);
  }
    
  update(formData: FormData): Observable<CommandResult<Player>> {
    return this.http.patch<CommandResult<Player>>(`${this.adminApiUrl}/patch`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/${id}`);
  }

  getPlayerTeamByPlayerId(playerId: number): Observable<any>{
    return this.http.get<any>(`${this.adminApiUrl}/${playerId}/playerteam/`);
  }
  updatePlayingStatus(playerTeamId: number, newStatus: boolean): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/playerteam/${playerTeamId}/${newStatus}`);
  }
}