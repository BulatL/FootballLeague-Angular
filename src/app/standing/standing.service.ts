import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environment';

@Injectable({
  providedIn: 'root'
})
export class StandingService {
  private apiUrl = environment.apiUrl + '/standings';


  constructor(private http: HttpClient) {}

  getStandings(seasonId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${seasonId}/list`);
  }
}