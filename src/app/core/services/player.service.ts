import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { PlayerDetailModel } from '../models/player-detail-model';
import { DreamTeamModel } from '../models/dream-team-model';

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
}