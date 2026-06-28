import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  registro(datos: any) {
    return this.http.post(`${this.url}/auth/registro`, datos);
  }

  login(datos: any) {
    return this.http.post(`${this.url}/auth/login`, datos);
  }
}