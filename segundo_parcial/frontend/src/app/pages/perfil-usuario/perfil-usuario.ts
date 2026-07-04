import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuarios } from '../../services/usuarios';
import { Publicaciones } from '../../services/publicaciones';
import { PublicacionCardComponent } from '../../components/publicacion-card/publicacion-card';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, PublicacionCardComponent],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css'
})
export class PerfilUsuario implements OnInit {
  usuario: any = null;
  publicaciones: any[] = [];
  usuarioActual: any = JSON.parse(localStorage.getItem('usuario') || '{}');

  constructor(
    private ruta: ActivatedRoute,
    private enrutador: Router,
    private servUsuarios: Usuarios,
    private servPublicaciones: Publicaciones,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.ruta.snapshot.paramMap.get('id') || '';
    this.cargarPerfil(id);
    this.cargarPublicaciones(id);
  }

  cargarPerfil(id: string) {
    this.servUsuarios.obtenerUno(id).subscribe({
      next: (respuesta: any) => {
        this.usuario = respuesta;
        this.cdr.detectChanges();
      },
      error: (error) => console.error(error)
    });
  }

  cargarPublicaciones(id: string) {
    this.servPublicaciones.listar('fecha', 3, 0, id).subscribe({
      next: (respuesta: any) => {
        this.publicaciones = respuesta;
        this.cdr.detectChanges();
      },
      error: (error) => console.error(error)
    });
  }

  toggleLike(publicacion: any) {
    const yaLikeo = publicacion.likes.includes(this.usuarioActual._id);
    if (yaLikeo) {
      this.servPublicaciones.quitarLike(publicacion._id).subscribe({
        next: () => this.cargarPublicaciones(this.ruta.snapshot.paramMap.get('id') || ''),
        error: (error) => console.error(error)
      });
    } else {
      this.servPublicaciones.darLike(publicacion._id).subscribe({
        next: () => this.cargarPublicaciones(this.ruta.snapshot.paramMap.get('id') || ''),
        error: (error) => console.error(error)
      });
    }
  }

  eliminar(id: string) {
    this.servPublicaciones.eliminar(id).subscribe({
      next: () => this.cargarPublicaciones(this.ruta.snapshot.paramMap.get('id') || ''),
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