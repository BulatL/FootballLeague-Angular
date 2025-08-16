import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest, User } from '../../models/auth.models';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/authentication';
  private readonly tokenKey = 'jwt-token';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {
    this.loadUserFromToken();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.setCurrentUser(response);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {})
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.setCurrentUser(response);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'Admin';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setCurrentUser(authResponse: AuthResponse): void {
    const decodedToken = this.jwtHelper.decodeToken(authResponse.token);
    const user: User = {
      id: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      email: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    };
    this.currentUserSubject.next(user);
  }

  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const user: User = {
        id: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        email: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      };
      this.currentUserSubject.next(user);
    }
  }
}