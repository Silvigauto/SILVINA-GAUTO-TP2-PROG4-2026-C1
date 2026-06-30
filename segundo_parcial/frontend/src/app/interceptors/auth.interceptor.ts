import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const enrutador = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && error.error?.message === 'Token inválido') {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        enrutador.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};