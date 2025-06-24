import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { Award } from '../models/award';
import { ApiListResponse } from '../../../shared/api-list-response';
import { CommandResult } from '../models/command-result';


@Injectable({ providedIn: 'root' })
export class RewardService {
  private apiUrl = `${environment.apiUrl}/awards`;

  constructor(private http: HttpClient) {}

    getAll(): Observable<ApiListResponse<Award>> {
        return this.http.get<ApiListResponse<Award>>(`${this.apiUrl}/list`);
    }
  
    getById(id: number): Observable<Award> {
        return this.http.get<Award>(`${this.apiUrl}/get`, {
        params: { id: id.toString() }
        });
    }
  
    create(formData: FormData): Observable<CommandResult<Award>> {
        return this.http.post<CommandResult<Award>>(`${this.apiUrl}/post`, formData);
    }
  
    update(id: number, formData: FormData): Observable<CommandResult<Award>> {
        return this.http.put<CommandResult<Award>>(`${this.apiUrl}/${id}`, formData);
    }
}