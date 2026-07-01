import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Estadisticas {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private obtenerHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  publicacionesPorUsuario(desde: string, hasta: string) {
    return this.http.get(
      `${this.url}/estadisticas/publicaciones-por-usuario?desde=${desde}&hasta=${hasta}`,
      { headers: this.obtenerHeaders() }
    );
  }

  comentariosPorTiempo(desde: string, hasta: string) {
    return this.http.get(
      `${this.url}/estadisticas/comentarios-por-tiempo?desde=${desde}&hasta=${hasta}`,
      { headers: this.obtenerHeaders() }
    );
  }

  comentariosPorPublicacion(desde: string, hasta: string) {
    return this.http.get(
      `${this.url}/estadisticas/comentarios-por-publicacion?desde=${desde}&hasta=${hasta}`,
      { headers: this.obtenerHeaders() }
    );
  }
}