import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Usuarios } from '../../services/usuarios';
import { Publicaciones } from '../../services/publicaciones';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css'
})
export class PerfilUsuario implements OnInit {
  usuario: any = null;
  publicaciones: any[] = [];
  usuarioActual: any = JSON.parse(localStorage.getItem('usuario') || '{}');

  constructor(
    private ruta: ActivatedRoute,
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
  eliminar(id: string) {
  this.servPublicaciones.eliminar(id).subscribe({
    next: () => {
      const usuarioId = this.ruta.snapshot.paramMap.get('id') || '';
      this.cargarPublicaciones(usuarioId);
    },
    error: (error) => console.error(error)
  });
}
}