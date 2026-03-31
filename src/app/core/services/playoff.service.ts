import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environment';
import { PlayoffBracket } from '../models/playoff-model';

@Injectable({  providedIn: 'root' })
export class PlayoffService {
  private apiUrl = environment.apiUrl + '/playoffs';

  constructor(private http: HttpClient) {}

  getBySeasonId(seasonId: number | null): Observable<PlayoffBracket> {
    return this.http.get<PlayoffBracket>(`${this.apiUrl}/season/${seasonId}`);
  }

  hasPlayoffStarted(seasonId: number): Observable<boolean> {
    return this.getBySeasonId(seasonId).pipe(
      map(bracket => !!bracket?.startDate && new Date(bracket.startDate) <= new Date()),
      catchError(() => of(false))
    );
  }
}