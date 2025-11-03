import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { PlayoffBracket, PlayoffFixture, PlayoffSeed } from '../models/playoff-model';
import { ApiListResponse } from '../../shared/api-list-response';

@Injectable({  providedIn: 'root' })
export class PlayoffService {
  private apiUrl = environment.apiUrl + '/playoffs';

  constructor(private http: HttpClient) {}

  getBySeasonId(seasonId: number | null): Observable<ApiListResponse<PlayoffBracket>> {
    return this.http.get<ApiListResponse<PlayoffBracket>>(`${this.apiUrl}/season/${seasonId}`);
  }
}