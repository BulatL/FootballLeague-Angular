import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../../environment';
import { CommandResult } from '../models/command-result';

export interface CreateRoundFixturesRequest {
  seasonId: number;
  roundNumber: number;
  fixtureDateTime?: string;
}

export interface CreateRoundFixturesResponse {
  createdFixturesCount: number;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class PlayoffService {
    private apiAdminUrl = `${environment.apiUrl}/admin/playoff`;

    constructor(private http: HttpClient) {}

    createNextRoundFixtures(seasonId: number | null, roundNumber: number, fixtureDateTime?: Date): Observable<CreateRoundFixturesResponse> {
        if (!seasonId) {
            return throwError(() => new Error('Season ID is required'));
        }

        const request: CreateRoundFixturesRequest = {
            seasonId: seasonId,
            roundNumber: roundNumber,
            fixtureDateTime: fixtureDateTime?.toISOString()
        };

        return this.http.post<CreateRoundFixturesResponse>(
            `${this.apiAdminUrl}/postplayofffixture`,
            request
        );
    }

  postOfficialResult(winningTeamId: number, fixtureId: number): Observable<CommandResult<any>> {
    return this.http.post<CommandResult<any>>(`${this.apiAdminUrl}/postOfficialResult/`, {Id: fixtureId, winningTeamId: winningTeamId});
  }
}