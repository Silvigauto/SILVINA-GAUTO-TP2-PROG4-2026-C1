import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css'
})
export class Publicaciones {
  constructor(private enrutador: Router) {}

  irAMiPerfil() {
    this.enrutador.navigate(['/mi-perfil']);
  }
}