import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css'
})
export class MiPerfil {
  usuario: any = JSON.parse(localStorage.getItem('usuario') || '{}');

  constructor(private enrutador: Router) {}

  irAPublicaciones() {
    this.enrutador.navigate(['/publicaciones']);
  }
}