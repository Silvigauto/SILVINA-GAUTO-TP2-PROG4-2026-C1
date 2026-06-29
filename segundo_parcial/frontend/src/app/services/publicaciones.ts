import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Publicaciones {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private obtenerHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

listar(orden?: string, limite?: number, offset?: number, usuarioId?: string) {
  let params = '';
  if (orden) params += `orden=${orden}&`;
  if (limite) params += `limite=${limite}&`;
  if (offset !== undefined) params += `offset=${offset}&`;
  if (usuarioId) params += `usuarioId=${usuarioId}`;
  return this.http.get(`${this.url}/publicaciones?${params}`);
}

  crear(datos: any) {
    return this.http.post(`${this.url}/publicaciones`, datos, { headers: this.obtenerHeaders() });
  }

  eliminar(id: string) {
    return this.http.delete(`${this.url}/publicaciones/${id}`, { headers: this.obtenerHeaders() });
  }

  darLike(id: string) {
    return this.http.post(`${this.url}/publicaciones/${id}/like`, {}, { headers: this.obtenerHeaders() });
  }

  quitarLike(id: string) {
    return this.http.delete(`${this.url}/publicaciones/${id}/like`, { headers: this.obtenerHeaders() });
  }
}