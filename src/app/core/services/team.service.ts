import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { TeamDetailModel } from '../models/team-detail-model';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private apiUrl = `${environment.apiUrl}/teams`;

   constructor(private http: HttpClient) {}

  getInfo(id: number): Observable<TeamDetailModel> {
    return this.http.get<TeamDetailModel>(`${this.apiUrl}/${id}`);
  }
}