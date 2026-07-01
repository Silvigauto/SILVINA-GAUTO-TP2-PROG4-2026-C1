import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from './services/auth';
import { LucideAngularModule, User, LayoutDashboard, DoorOpen, Users, CircleUserRound, Newspaper } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LucideAngularModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  mostrarModal = false;
  readonly User = User;
  readonly LayoutDashboard = LayoutDashboard;
  readonly DoorOpen = DoorOpen;
  readonly Users = Users;
  readonly CircleUserRound = CircleUserRound
  readonly Newspaper = Newspaper;

  usuario: any = JSON.parse(localStorage.getItem('usuario') || '{}');

  constructor(private servAuth: Auth, private enrutador: Router, private cdr: ChangeDetectorRef) {
    this.servAuth.loginExitoso.subscribe(() => {
      this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      this.iniciarContador();
      this.cdr.detectChanges();
    });
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('token');
  }

  iniciarContador() {
    setTimeout(() => {
      this.mostrarModal = true;
      this.cdr.detectChanges();
    }, 10 * 60 * 1000);
  }

  extenderSesion() {
    this.servAuth.refrescar().subscribe({
      next: (respuesta: any) => {
        localStorage.setItem('token', respuesta.token);
        this.mostrarModal = false;
        this.iniciarContador();
      },
      error: () => {
        this.enrutador.navigate(['/login']);
      }
    });
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuario = {};
    this.mostrarModal = false;
    this.cdr.detectChanges();
    this.enrutador.navigate(['/login']);
  }

  irAPublicaciones() {
    this.enrutador.navigate(['/publicaciones']);
  }

  irAMiPerfil() {
    this.enrutador.navigate(['/mi-perfil']);
  }

  irADashboardUsuarios() {
    this.enrutador.navigate(['/dashboard-usuarios']);
  }

  irADashboardEstadisticas() {
    this.enrutador.navigate(['/dashboard-estadisticas']);
  }
}