import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Publicaciones } from '../../services/publicaciones';
import { PublicacionCardComponent } from '../../components/publicacion-card/publicacion-card';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, PublicacionCardComponent],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css'
})
export class MiPerfil implements OnInit {
  usuario: any = JSON.parse(localStorage.getItem('usuario') || '{}');
  misPublicaciones: any[] = [];

  constructor(
    private servPublicaciones: Publicaciones,
    private enrutador: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarMisPublicaciones();
  }

  cargarMisPublicaciones() {
    this.servPublicaciones.listar('fecha', 3, 0, this.usuario._id).subscribe({
      next: (respuesta: any) => {
        this.misPublicaciones = [...respuesta];
        this.cargarComentarios();
      },
      error: (error) => console.error(error)
    });
  }

  cargarComentarios() {
    this.misPublicaciones.forEach((publicacion, index) => {
      this.servPublicaciones.listarComentarios(publicacion._id, 5, 0).subscribe({
        next: (comentarios: any) => {
          this.misPublicaciones[index].comentarios = comentarios;
          this.cdr.detectChanges();
        },
        error: (error) => console.error(error)
      });
    });
  }

  toggleLike(publicacion: any) {
    const yaLikeo = publicacion.likes.includes(this.usuario._id);
    if (yaLikeo) {
      this.servPublicaciones.quitarLike(publicacion._id).subscribe({
        next: () => this.cargarMisPublicaciones(),
        error: (error) => console.error(error)
      });
    } else {
      this.servPublicaciones.darLike(publicacion._id).subscribe({
        next: () => this.cargarMisPublicaciones(),
        error: (error) => console.error(error)
      });
    }
  }

  eliminar(id: string) {
    this.servPublicaciones.eliminar(id).subscribe({
      next: () => this.cargarMisPublicaciones(),
      error: (error) => console.error(error)
    });
  }

  verPublicacion(id: string) {
    this.enrutador.navigate(['/publicacion', id]);
  }

  verPerfil(id: string) {
    this.enrutador.navigate(['/perfil', id]);
  }
}