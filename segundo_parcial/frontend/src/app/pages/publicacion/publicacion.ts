import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Publicaciones } from '../../services/publicaciones';

@Component({
  selector: 'app-publicacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css'
})
export class Publicacion implements OnInit {
  publicacionId: string = '';
  comentarios: any[] = [];
  nuevoComentario: string = '';
  usuarioActual: any = JSON.parse(localStorage.getItem('usuario') || '{}');
  limite = 5;
  offset = 0;
  hayMas = true;
  comentarioEditandoId: string | null = null;
  mensajeEditando: string = '';
  publicacion: any = null;

  constructor(
    private ruta: ActivatedRoute,
    private servPublicaciones: Publicaciones,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.publicacionId = this.ruta.snapshot.paramMap.get('id') || '';
    this.cargarPublicacion();
    this.cargarComentarios();
  }

  cargarPublicacion() {
    this.servPublicaciones.obtenerUna(this.publicacionId).subscribe({
      next: (respuesta: any) => {
        this.publicacion = respuesta;
        this.cdr.detectChanges();
      },
      error: (error) => console.error(error)
    });
  }

  cargarComentarios() {
    this.servPublicaciones.listarComentarios(this.publicacionId, this.limite, this.offset).subscribe({
      next: (respuesta: any) => {
        this.comentarios = [...this.comentarios, ...respuesta];
        if (respuesta.length < this.limite) this.hayMas = false;
        this.cdr.detectChanges();
      },
      error: (error) => console.error(error)
    });
  }

  cargarMas() {
    this.offset += this.limite;
    this.cargarComentarios();
  }

  agregarComentario() {
  if (this.nuevoComentario.trim()) {
    this.servPublicaciones.agregarComentario(this.publicacionId, this.nuevoComentario).subscribe({
      next: () => {
        this.nuevoComentario = '';
        this.comentarios = [];
        this.offset = 0;
        this.hayMas = true;
        this.cargarComentarios();
        this.cdr.detectChanges();
      },
      error: (error) => console.error(error)
    });
  }
}

  iniciarEdicion(comentario: any) {
    this.comentarioEditandoId = comentario._id;
    this.mensajeEditando = comentario.mensaje;
  }

  guardarEdicion(comentario: any) {
    this.servPublicaciones.editarComentario(this.publicacionId, comentario._id, this.mensajeEditando).subscribe({
      next: () => {
        this.comentarioEditandoId = null;
        this.comentarios = [];
        this.offset = 0;
        this.hayMas = true;
        this.cargarComentarios();
      },
      error: (error) => console.error(error)
    });
  }

  cancelarEdicion() {
    this.comentarioEditandoId = null;
    this.mensajeEditando = '';
  }

  
}