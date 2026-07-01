import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuarios } from '../../services/usuarios';

@Component({
  selector: 'app-dashboard-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-usuarios.html',
  styleUrl: './dashboard-usuarios.css'
})
export class DashboardUsuarios implements OnInit {
  listadoUsuarios: any[] = [];
  usuarioActual: any = JSON.parse(localStorage.getItem('usuario') || '{}');
  mostrarFormulario = false;
  nuevoUsuario = {
    nombre: '',
    apellido: '',
    email: '',
    username: '',
    contrasena: '',
    fechaNacimiento: '',
    descripcion: '',
    rol: 'usuario'
  };

  constructor(
    private servUsuarios: Usuarios,
    private enrutador: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.usuarioActual.rol !== 'administrador') {
      this.enrutador.navigate(['/publicaciones']);
    }
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.servUsuarios.listar().subscribe({
      next: (respuesta: any) => {
        this.listadoUsuarios = [...respuesta];
        this.cdr.detectChanges();
      },
      error: (error) => console.error(error)
    });
  }

  crearUsuario() {
    const datos = { ...this.nuevoUsuario, contraseña: this.nuevoUsuario.contrasena };
    this.servUsuarios.crear(datos).subscribe({
      next: () => {
        this.mostrarFormulario = false;
        this.nuevoUsuario = { nombre: '', apellido: '', email: '', username: '', contrasena: '', fechaNacimiento: '', descripcion: '', rol: 'usuario' };
        this.cargarUsuarios();
      },
      error: (error) => console.error(error)
    });
  }

  deshabilitar(id: string) {
    this.servUsuarios.deshabilitar(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: (error) => console.error(error)
    });
  }

  habilitar(id: string) {
    this.servUsuarios.habilitar(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: (error) => console.error(error)
    });
  }
}