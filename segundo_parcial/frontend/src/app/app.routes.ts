import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { PublicacionesPage } from './pages/publicaciones/publicaciones';
import { MiPerfil } from './pages/mi-perfil/mi-perfil';
import { Cargando } from './pages/cargando/cargando';
import { Publicacion } from './pages/publicacion/publicacion';
import { authGuard } from '../app/guards/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'cargando', pathMatch: 'full' },
  { path: 'cargando', component: Cargando },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'publicaciones', component: PublicacionesPage, canActivate: [authGuard] },
  { path: 'mi-perfil', component: MiPerfil, canActivate: [authGuard] },
  { path: 'publicacion/:id', component: Publicacion, canActivate: [authGuard] },
];