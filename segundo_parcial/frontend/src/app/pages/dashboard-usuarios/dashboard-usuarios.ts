import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Usuarios } from '../../services/usuarios';

@Component({
  selector: 'app-dashboard-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-usuarios.html',
  styleUrl: './dashboard-usuarios.css'
})
export class DashboardUsuarios implements OnInit {
  listadoUsuarios: any[] = [];
  usuarioActual: any = JSON.parse(localStorage.getItem('usuario') || '{}');
  mostrarFormulario = false;
  mensajeError: string = '';
  formularioUsuario: FormGroup;

  constructor(
    private servUsuarios: Usuarios,
    private enrutador: Router,
    private cdr: ChangeDetectorRef,
    private constructorFormulario: FormBuilder
  ) {
    this.formularioUsuario = this.constructorFormulario.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*[A-Z])(?=.*[0-9])/)]],
      fechaNacimiento: ['', Validators.required],
      descripcion: ['', Validators.required],
      rol: ['usuario', Validators.required]
    });
  }

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
    if (this.formularioUsuario.invalid) return;

    this.mensajeError = '';
    const datos = this.formularioUsuario.value;
    this.servUsuarios.crear(datos).subscribe({
      next: () => {
        this.mostrarFormulario = false;
        this.formularioUsuario.reset({ rol: 'usuario' });
        this.cargarUsuarios();
      },
      error: (error) => {
        if (error.status === 400) {
          this.mensajeError = 'El email o nombre de usuario ya existe';
        } else {
          this.mensajeError = 'Error al crear el usuario';
        }
        this.cdr.detectChanges();
      }
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