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
    localStorage.setItem('seasonId', id.toString());
    this.seasonIdSubject.next(id);
  }

  getSeasonId(): number | null {
    const current = this.seasonIdSubject.value;
    if (current !== null) return current;

    const stored = localStorage.getItem('seasonId');
    return stored ? Number(stored) : null;
  }

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/list`);
  }
}