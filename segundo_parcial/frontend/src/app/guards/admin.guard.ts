import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const enrutador = inject(Router);
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  if (usuario.rol === 'administrador') {
    return true;
  } else {
    enrutador.navigate(['/publicaciones']);
    return false;
  }
};