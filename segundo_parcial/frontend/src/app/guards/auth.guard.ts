import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const enrutador = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  } else {
    enrutador.navigate(['/login']);
    return false;
  }
};