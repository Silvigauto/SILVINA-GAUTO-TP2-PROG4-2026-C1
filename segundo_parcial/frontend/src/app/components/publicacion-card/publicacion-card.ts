import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Heart, Eye, Trash2 } from 'lucide-angular';
import { LikesTextoPipe } from '../../pipes/likes-texto-pipe';
import { TiempoTranscurridoPipe } from '../../pipes/tiempo-transcurrido-pipe';
import { TruncarPipe } from '../../pipes/truncar-pipe';
import { TooltipUsuarioDirective } from '../../directives/tooltip-usuario';
import { AnimacionLikeDirective } from '../../directives/animacion-like';
import { ResaltarEditadoDirective } from '../../directives/resaltar-editado';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, LikesTextoPipe, TiempoTranscurridoPipe, TruncarPipe, TooltipUsuarioDirective, AnimacionLikeDirective],
  templateUrl: './publicacion-card.html',
  styleUrl: './publicacion-card.css'
})
export class PublicacionCardComponent {
  @Input() publicacion: any;
  @Input() usuarioActual: any;

  @Output() alDarLike = new EventEmitter<any>();
  @Output() alEliminar = new EventEmitter<string>();
  @Output() alVer = new EventEmitter<string>();
  @Output() alVerPerfil = new EventEmitter<string>();

  readonly Heart = Heart;
  readonly Eye = Eye;
  readonly Trash2 = Trash2;

  toggleLike() {
    this.alDarLike.emit(this.publicacion);
  }

  eliminar() {
    this.alEliminar.emit(this.publicacion._id);
  }

  verPublicacion() {
    this.alVer.emit(this.publicacion._id);
  }

  verPerfil() {
    this.alVerPerfil.emit(this.publicacion.usuario?._id);
  }
}