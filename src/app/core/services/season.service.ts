import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from './../../../environment';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  private apiUrl = `${environment.apiUrl}/seasons`;
  private seasonIdSubject = new BehaviorSubject<number | null>(null);
  seasonId$ = this.seasonIdSubject.asObservable();

  constructor(private http: HttpClient) {}

  setSeasonId(id: number) {
    this.seasonIdSubject.next(id);
  }

  getSeasonId(): number | null {
    return this.seasonIdSubject.value; // synchronous getter
  }

  getAll(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/list`);
  }
}