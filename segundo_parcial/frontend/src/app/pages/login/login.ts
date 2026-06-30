import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  formularioLogin: FormGroup;

  constructor(
    private constructorFormulario: FormBuilder,
    private enrutador: Router,
    private servAuth: Auth
  ) {
    this.formularioLogin = this.constructorFormulario.group({
      usuario: ['', Validators.required],
      contraseña: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

alEnviar() {
  if (this.formularioLogin.valid) {
    this.servAuth.login(this.formularioLogin.value).subscribe({
      next: (respuesta: any) => {
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
        this.servAuth.loginExitoso.emit();
        this.enrutador.navigate(['/publicaciones']);
      },
      error: (error) => {
        console.error(error);
        alert('Usuario o contraseña incorrectos');
      }
    });
  }
}

  irARegistro() {
    this.enrutador.navigate(['/registro']);
  }
}