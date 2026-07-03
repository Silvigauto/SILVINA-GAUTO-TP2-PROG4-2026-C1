import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { PublicacionesPage } from './pages/publicaciones/publicaciones';
import { MiPerfil } from './pages/mi-perfil/mi-perfil';
import { Cargando } from './pages/cargando/cargando';
import { Publicacion } from './pages/publicacion/publicacion';
import { authGuard } from '../app/guards/auth.guard';
import { DashboardUsuarios } from './pages/dashboard-usuarios/dashboard-usuarios';
import { DashboardEstadisticas } from './pages/dashboard-estadisticas/dashboard-estadisticas';
import { adminGuard } from './guards/admin.guard';
import { PerfilUsuario } from './pages/perfil-usuario/perfil-usuario';


export const routes: Routes = [
  { path: '', redirectTo: 'cargando', pathMatch: 'full' },
  { path: 'cargando', component: Cargando },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'publicaciones', component: PublicacionesPage, canActivate: [authGuard] },
  { path: 'mi-perfil', component: MiPerfil, canActivate: [authGuard] },
  { path: 'publicacion/:id', component: Publicacion, canActivate: [authGuard] },
  { path: 'dashboard-usuarios', component: DashboardUsuarios, canActivate: [authGuard] },
  { path: 'dashboard-estadisticas', component: DashboardEstadisticas, canActivate: [authGuard] },
  { path: 'dashboard-usuarios', component: DashboardUsuarios, canActivate: [authGuard, adminGuard] },
{ path: 'dashboard-estadisticas', component: DashboardEstadisticas, canActivate: [authGuard, adminGuard] },
{ path: 'perfil/:id', component: PerfilUsuario, canActivate: [authGuard] },
];