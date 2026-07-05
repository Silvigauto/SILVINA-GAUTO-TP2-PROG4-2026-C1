import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Publicaciones } from '../../services/publicaciones';
import { FormsModule } from '@angular/forms';
import { LikesTextoPipe } from '../../pipes/likes-texto-pipe'
import { TiempoTranscurridoPipe } from '../../pipes/tiempo-transcurrido-pipe';
import { TruncarPipe } from '../../pipes/truncar-pipe';
import { ResaltarEditadoDirective } from '../../directives/resaltar-editado';
import { TooltipUsuarioDirective } from '../../directives/tooltip-usuario';
import { AnimacionLikeDirective } from '../../directives/animacion-like';
import { LucideAngularModule, Heart, Eye, Trash2 } from 'lucide-angular';
import { PublicacionCardComponent } from '../../components/publicacion-card/publicacion-card';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PublicacionCardComponent],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css'
})
export class PublicacionesPage implements OnInit, OnDestroy {
  listadoPublicaciones: any[] = [];
  usuarioActual: any = JSON.parse(localStorage.getItem('usuario') || '{}');
  offset = 0;
  limite = 10;
  nuevaPublicacion = { titulo: '', mensaje: '' };
  mensajeError: string = '';
  imagenPublicacion: File | null = null;
  ordenActual: string = 'fecha';
  cargandoMas = false;
  readonly Heart = Heart;
  readonly Eye = Eye;
  readonly Trash2 = Trash2;
  @ViewChild('inputImagen') inputImagen!: ElementRef;

  constructor(private servPublicaciones: Publicaciones, private enrutador: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarPublicaciones();
    window.addEventListener('scroll', this.alScrollear.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.alScrollear.bind(this));
  }

  alScrollear() {
    const alturaTotal = document.documentElement.scrollHeight;
    const alturaVentana = window.innerHeight;
    const scrollActual = window.scrollY;

    if (scrollActual + alturaVentana >= alturaTotal - 100) {
      this.cargarMasPublicaciones();
    }
  }

  cargarMasPublicaciones() {
  if (this.cargandoMas) return;
  this.cargandoMas = true;
  this.offset += this.limite;

  this.servPublicaciones.listar(this.ordenActual, this.limite, this.offset).subscribe({
    next: (respuesta: any) => {
      if (respuesta.length > 0) {
        this.listadoPublicaciones = [...this.listadoPublicaciones, ...respuesta];
        this.cdr.detectChanges();
      } else {
        this.offset -= this.limite;
        window.removeEventListener('scroll', this.alScrollear.bind(this));
      }
      this.cargandoMas = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error(error);
      this.cargandoMas = false;
      this.cdr.detectChanges();
    }
  });
}

  alSeleccionarImagen(evento: Event) {
    const input = evento.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imagenPublicacion = input.files[0];
    }
  }

  crearPublicacion() {
    if (!this.nuevaPublicacion.titulo || !this.nuevaPublicacion.mensaje) {
      this.mensajeError = 'El título y el texto son obligatorios';
      this.cdr.detectChanges();
      return;
    }

    this.mensajeError = '';
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
        this.offset = 0;
        this.cargarPublicaciones();
        this.cdr.detectChanges();
      },
      error: (error) => console.error(error)
    });
  }

  cargarPublicaciones() {
    this.offset = 0;
    this.servPublicaciones.listar(this.ordenActual, this.limite, this.offset).subscribe({
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

  verPublicacion(id: string) {
    this.enrutador.navigate(['/publicacion', id]);
  }

  cambiarOrden(orden: string) {
    this.ordenActual = orden;
    this.cargarPublicaciones();
  }

  verPerfil(id: string) {
  this.enrutador.navigate(['/perfil', id]);
}

}