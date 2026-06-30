import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-cargando',
  standalone: true,
  imports: [],
  templateUrl: './cargando.html',
  styleUrl: './cargando.css'
})
export class Cargando implements OnInit {

  constructor(private servAuth: Auth, private enrutador: Router) {}

  ngOnInit() {
    this.verificarToken();
  }

  verificarToken() {
    this.servAuth.autorizar().subscribe({
      next: () => {
        this.enrutador.navigate(['/publicaciones']);
      },
      error: () => {
        this.enrutador.navigate(['/login']);
      }
    });
  }
}