import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Publicaciones } from '../../services/publicaciones';
import { FormsModule } from '@angular/forms';
import { LikesTextoPipe } from '../../pipes/likes-texto-pipe'
import { TiempoTranscurridoPipe } from '../../pipes/tiempo-transcurrido-pipe';
import { TruncarPipe } from '../../pipes/truncar-pipe';
import { ConfirmarAccionDirective } from '../../directives/confirmar-accion';
import { TooltipUsuarioDirective } from '../../directives/tooltip-usuario';
import { AnimacionLikeDirective } from '../../directives/animacion-like';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, LikesTextoPipe, TiempoTranscurridoPipe, TruncarPipe, ConfirmarAccionDirective, TooltipUsuarioDirective, AnimacionLikeDirective],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css'
})
export class PublicacionesPage {
  listadoPublicaciones: any[] = [];
  usuarioActual: any = JSON.parse(localStorage.getItem('usuario') || '{}');
  offset = 0;
  limite = 10;

  constructor(private servPublicaciones: Publicaciones, private enrutador: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarPublicaciones();
  }
  nuevaPublicacion = { titulo: '', mensaje: '' };

  crearPublicacion() {
    console.log('intentando crear:', this.nuevaPublicacion);
    if (this.nuevaPublicacion.titulo && this.nuevaPublicacion.mensaje) {
      console.log('datos válidos, enviando...');
      this.servPublicaciones.crear(this.nuevaPublicacion).subscribe({
        next: (respuesta) => {
          console.log('publicación creada:', respuesta);
          this.nuevaPublicacion = { titulo: '', mensaje: '' };
          this.cargarPublicaciones();
        },
        error: (error) => console.error(error)
      });
    }
  }
  cargarPublicaciones() {
  this.servPublicaciones.listar('fecha', this.limite, this.offset).subscribe({
    next: (respuesta: any) => {
      this.listadoPublicaciones = [...respuesta];
      this.cdr.detectChanges();
    },
    error: (error) => console.error(error)
  });
}

  toggleLike(publicacion: any) {
    const yaLikeo = publicacion.likes.includes(this.usuarioActual._id);
    if (yaLikeo) {
      this.servPublicaciones.quitarLike(publicacion._id).subscribe({
        next: () => this.cargarPublicaciones(),
        error: (error) => console.error(error)
      });
    } else {
      this.servPublicaciones.darLike(publicacion._id).subscribe({
        next: () => this.cargarPublicaciones(),
        error: (error) => console.error(error)
      });
    }
  }

  eliminar(id: string) {
    this.servPublicaciones.eliminar(id).subscribe({
      next: () => this.cargarPublicaciones(),
      error: (error) => console.error(error)
    });
  }

  irAMiPerfil() {
    this.enrutador.navigate(['/mi-perfil']);
  }

  verPublicacion(id: string) {
  this.enrutador.navigate(['/publicacion', id]);
  }
  irADashboard() {
  this.enrutador.navigate(['/dashboard-usuarios']);
}

cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  this.enrutador.navigate(['/login']);
}
}