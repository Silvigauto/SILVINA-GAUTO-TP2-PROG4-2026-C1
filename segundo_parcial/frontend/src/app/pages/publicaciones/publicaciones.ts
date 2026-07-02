import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
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
import { LucideAngularModule, Heart, Eye, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, LikesTextoPipe, TiempoTranscurridoPipe, TruncarPipe, ConfirmarAccionDirective, TooltipUsuarioDirective, AnimacionLikeDirective, LucideAngularModule],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css'
})
export class PublicacionesPage {
  listadoPublicaciones: any[] = [];
  usuarioActual: any = JSON.parse(localStorage.getItem('usuario') || '{}');
  offset = 0;
  limite = 10;
  nuevaPublicacion = { titulo: '', mensaje: '' };
  imagenPublicacion: File | null = null;
  readonly Heart = Heart;
  readonly Eye = Eye;
  readonly Trash2 = Trash2;
  @ViewChild('inputImagen') inputImagen!: ElementRef;

  constructor(private servPublicaciones: Publicaciones, private enrutador: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarPublicaciones();
  }

  alSeleccionarImagen(evento: Event) {
    const input = evento.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imagenPublicacion = input.files[0];
    }
  }

crearPublicacion() {
  if (this.nuevaPublicacion.titulo && this.nuevaPublicacion.mensaje) {
    const formData = new FormData();
    formData.append('titulo', this.nuevaPublicacion.titulo);
    formData.append('mensaje', this.nuevaPublicacion.mensaje);
    if (this.imagenPublicacion) {
      formData.append('imagen', this.imagenPublicacion);
    }

    this.servPublicaciones.crear(formData).subscribe({
      next: () => {
        this.nuevaPublicacion = { titulo: '', mensaje: '' };
        this.imagenPublicacion = null;
        if (this.inputImagen) this.inputImagen.nativeElement.value = '';
        this.cargarPublicaciones();
        this.cdr.detectChanges();
      },
      error: (error) => console.error(error)
    });
  }
}

  cargarPublicaciones() {
  this.servPublicaciones.listar('fecha', this.limite, this.offset).subscribe({
    next: (respuesta: any) => {
      this.listadoPublicaciones = [...respuesta];
      console.log('usuario actual id:', this.usuarioActual._id);
      console.log('usuario publicacion id:', respuesta[0]?.usuario?._id);
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

  verPublicacion(id: string) {
    this.enrutador.navigate(['/publicacion', id]);
  }
}