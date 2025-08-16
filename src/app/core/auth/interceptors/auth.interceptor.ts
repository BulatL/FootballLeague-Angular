import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token && authService.isAuthenticated()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expired or invalid
        if (token && !authService.isAuthenticated()) {
          // Try to refresh token
          return authService.refreshToken().pipe(
            switchMap(() => {
              const newToken = authService.getToken();
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next(newReq);
            }),
            catchError(() => {
              authService.logout();
              return throwError(() => error);
            })
          );
        } else {
          authService.logout();
        }
      }
      return throwError(() => error);
    })
  );
};