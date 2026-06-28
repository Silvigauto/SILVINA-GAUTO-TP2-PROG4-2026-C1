import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  formularioRegistro: FormGroup;
  imagenPerfil: File | null = null;

  constructor(
    private constructorFormulario: FormBuilder, 
    private enrutador: Router,
    private servAuth: Auth
  ) {
    this.formularioRegistro = this.constructorFormulario.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      contraseña: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*[A-Z])(?=.*[0-9])/)]],
      repetirContraseña: ['', Validators.required],
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
      const datos = {
        nombre: this.formularioRegistro.value.nombre,
        apellido: this.formularioRegistro.value.apellido,
        email: this.formularioRegistro.value.email,
        username: this.formularioRegistro.value.username,
        contraseña: this.formularioRegistro.value.contraseña,
        fechaNacimiento: this.formularioRegistro.value.fechaNacimiento,
        descripcion: this.formularioRegistro.value.descripcion,
      };

      this.servAuth.registro(datos).subscribe({
        next: (respuesta: any) => {
          localStorage.setItem('token', respuesta.token);
          localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
          this.enrutador.navigate(['/publicaciones']);
        },
        error: (error) => {
          console.error(error);
          alert('Error al registrarse');
        }
      });
    }
  }

  irALogin() {
    this.enrutador.navigate(['/login']);
  }
}