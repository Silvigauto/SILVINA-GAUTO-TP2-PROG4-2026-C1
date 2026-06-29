import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Publicaciones } from '../../services/publicaciones';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css'
})
export class MiPerfil implements OnInit {
  usuario: any = JSON.parse(localStorage.getItem('usuario') || '{}');
  misPublicaciones: any[] = [];

  constructor(private servPublicaciones: Publicaciones, private enrutador: Router) {}

  ngOnInit() {
    this.cargarMisPublicaciones();
  }

  cargarMisPublicaciones() {
    this.servPublicaciones.listar('fecha', 3, 0, this.usuario._id).subscribe({
      next: (respuesta: any) => {
        this.misPublicaciones = respuesta;
      },
      error: (error) => console.error(error)
    });
  }

  irAPublicaciones() {
    this.enrutador.navigate(['/publicaciones']);
  }
}