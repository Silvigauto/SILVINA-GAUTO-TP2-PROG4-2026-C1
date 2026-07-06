import { Injectable, EventEmitter} from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private url = environment.apiUrl; //url del backend
  loginExitoso = new EventEmitter<void>();


  constructor(private http: HttpClient) {}

  registro(datos: any) {
    return this.http.post(`${this.url}/auth/registro`, datos);
  }

  login(datos: any) {
    return this.http.post(`${this.url}/auth/login`, datos);
  }
  autorizar() {
  const token = localStorage.getItem('token');
  return this.http.post(`${this.url}/auth/autorizar`, {}, {
    headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
  });
  }

  refrescar() {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.url}/auth/refrescar`, {}, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    });
  }
}