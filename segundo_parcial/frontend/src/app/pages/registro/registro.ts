import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,LucideAngularModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  formularioRegistro: FormGroup;
  imagenPerfil: File | null = null;
  mensajeError: string = '';
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  mostrarContrasena = false;
  mostrarRepetirContrasena = false;

  constructor(
    private constructorFormulario: FormBuilder, 
    private enrutador: Router,
    private servAuth: Auth,
    private cdr: ChangeDetectorRef
  ) {
    this.formularioRegistro = this.constructorFormulario.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*[A-Z])(?=.*[0-9])/)]],
      repetirContrasena: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  alSeleccionarImagen(evento: Event) {
    const input = evento.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imagenPerfil = input.files[0];
    }
  }

  alEnviar() {
    if (this.formularioRegistro.valid) {
      this.mensajeError = '';
      const formData = new FormData();
      formData.append('nombre', this.formularioRegistro.value.nombre);
      formData.append('apellido', this.formularioRegistro.value.apellido);
      formData.append('email', this.formularioRegistro.value.email);
      formData.append('username', this.formularioRegistro.value.username);
      formData.append('contrasena', this.formularioRegistro.value.contrasena);
      formData.append('fechaNacimiento', this.formularioRegistro.value.fechaNacimiento);
      formData.append('descripcion', this.formularioRegistro.value.descripcion);
      if (this.imagenPerfil) {
        formData.append('foto', this.imagenPerfil);
      }

      this.servAuth.registro(formData).subscribe({
        next: (respuesta: any) => {
          localStorage.setItem('token', respuesta.token);
          localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
          this.enrutador.navigate(['/publicaciones']);
        },
        error: (error) => {
          this.mensajeError = 'Error al registrarse. Verificá los datos ingresados.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  irALogin() {
    this.enrutador.navigate(['/login']);
  }
}