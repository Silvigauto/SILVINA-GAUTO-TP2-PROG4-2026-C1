import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  mostrarModal = false;

  constructor(private servAuth: Auth, private enrutador: Router, private cdr: ChangeDetectorRef) {
    this.servAuth.loginExitoso.subscribe(() => {
      console.log('login exitoso recibido en app');
      this.iniciarContador();
    });
  }

  iniciarContador() {
  setTimeout(() => {
    this.mostrarModal = true;
    this.cdr.detectChanges();
  },10 * 60 * 1000  );
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
    this.mostrarModal = false;
    this.enrutador.navigate(['/login']);
  }
}