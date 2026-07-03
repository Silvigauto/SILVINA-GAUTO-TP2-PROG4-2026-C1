import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Usuarios {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private obtenerHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  listar() {
    return this.http.get(`${this.url}/usuarios`, { headers: this.obtenerHeaders() });
  }

  crear(datos: any) {
    return this.http.post(`${this.url}/usuarios`, datos, { headers: this.obtenerHeaders() });
  }

  deshabilitar(id: string) {
    return this.http.delete(`${this.url}/usuarios/${id}`, { headers: this.obtenerHeaders() });
  }

  habilitar(id: string) {
    return this.http.post(`${this.url}/usuarios/${id}/habilitar`, {}, { headers: this.obtenerHeaders() });
  }
  obtenerUno(id: string) {
  return this.http.get(`${this.url}/usuarios/${id}`, { headers: this.obtenerHeaders() });
}
}