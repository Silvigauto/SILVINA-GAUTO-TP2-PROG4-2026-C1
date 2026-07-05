import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Estadisticas } from '../../services/estadisticas';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-estadisticas.html',
  styleUrl: './dashboard-estadisticas.css'
})
export class DashboardEstadisticas implements OnInit {
  usuarioActual: any = JSON.parse(localStorage.getItem('usuario') || '{}');
  desde: string = '';
  hasta: string = '';
  datosPublicaciones: any[] = [];
  datosComentariosTiempo: any[] = [];
  datosComentariosPublicacion: any[] = [];
  datosLogins: any[] = [];
  datosVisitas: any[] = [];
  datosLikes: any[] = [];
  graficoPublicaciones: any = null;
  graficoComentariosTiempo: any = null;
  graficoComentariosPublicacion: any = null;
  graficoLogins: any = null;
  graficoVisitas: any = null;
  graficoLikes: any = null;

  constructor(
    private servEstadisticas: Estadisticas,
    private enrutador: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.usuarioActual.rol !== 'administrador') {
      this.enrutador.navigate(['/publicaciones']);
    }
    const hoy = new Date();
    const hace8dias = new Date();
    hace8dias.setDate(hoy.getDate() - 8);
    this.hasta = hoy.toISOString().split('T')[0];
    this.desde = hace8dias.toISOString().split('T')[0];
        this.cargarEstadisticas();
  }

  ajustarFechas() {
    const desde = this.desde + 'T03:00:00.000Z';
    const hasta = this.hasta + 'T02:59:59.999Z';
    return { desde, hasta };
  }

  cargarEstadisticas() {
    
    const { desde, hasta } = this.ajustarFechas();
    console.log('desde:', desde);
    console.log('hasta:', hasta);
    this.servEstadisticas.publicacionesPorUsuario(desde, hasta).subscribe({
      next: (respuesta: any) => { this.datosPublicaciones = respuesta; this.renderizarGraficoPublicaciones(); },
      error: (error) => console.error(error)
    });

    this.servEstadisticas.comentariosPorTiempo(desde, hasta).subscribe({
      next: (respuesta: any) => { this.datosComentariosTiempo = respuesta; this.renderizarGraficoComentariosTiempo(); },
      error: (error) => console.error(error)
    });

    this.servEstadisticas.comentariosPorPublicacion(desde, hasta).subscribe({
      next: (respuesta: any) => { this.datosComentariosPublicacion = respuesta; this.renderizarGraficoComentariosPublicacion(); },
      error: (error) => console.error(error)
    });

    this.servEstadisticas.loginsPorUsuario(desde, hasta).subscribe({
      next: (respuesta: any) => { this.datosLogins = respuesta; this.renderizarGraficoLogins(); },
      error: (error) => console.error(error)
    });

    this.servEstadisticas.visitasPorPerfil(desde, hasta).subscribe({
      next: (respuesta: any) => { this.datosVisitas = respuesta; this.renderizarGraficoVisitas(); },
      error: (error) => console.error(error)
    });

    this.servEstadisticas.likesPorDia(desde, hasta).subscribe({
      next: (respuesta: any) => { this.datosLikes = respuesta; this.renderizarGraficoLikes(); },
      error: (error) => console.error(error)
    });
  }

  renderizarGraficoPublicaciones() {
    if (this.graficoPublicaciones) this.graficoPublicaciones.destroy();
    const canvas = document.getElementById('graficoPublicaciones') as HTMLCanvasElement;
    if (!canvas) return;
    this.graficoPublicaciones = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.datosPublicaciones.map(d => `${d.nombre} ${d.apellido}`),
        datasets: [{ label: 'Publicaciones', data: this.datosPublicaciones.map(d => d.total), backgroundColor: '#FFC300' }]
      }
    });
  }

  renderizarGraficoComentariosTiempo() {
    if (this.graficoComentariosTiempo) this.graficoComentariosTiempo.destroy();
    const canvas = document.getElementById('graficoComentariosTiempo') as HTMLCanvasElement;
    if (!canvas) return;
    this.graficoComentariosTiempo = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.datosComentariosTiempo.map(d => d._id),
        datasets: [{ label: 'Comentarios', data: this.datosComentariosTiempo.map(d => d.total), borderColor: '#444', fill: false }]
      }
    });
  }

  renderizarGraficoComentariosPublicacion() {
    if (this.graficoComentariosPublicacion) this.graficoComentariosPublicacion.destroy();
    const canvas = document.getElementById('graficoComentariosPublicacion') as HTMLCanvasElement;
    if (!canvas) return;
    this.graficoComentariosPublicacion = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: this.datosComentariosPublicacion.map(d => d.titulo),
        datasets: [{ data: this.datosComentariosPublicacion.map(d => d.total), backgroundColor: ['#FFC300', '#555', '#888', '#aaa', '#ccc'] }]
      }
    });
  }

  renderizarGraficoLogins() {
    if (this.graficoLogins) this.graficoLogins.destroy();
    const canvas = document.getElementById('graficoLogins') as HTMLCanvasElement;
    if (!canvas) return;
    this.graficoLogins = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.datosLogins.map(d => `${d.nombre} ${d.apellido}`),
        datasets: [{ label: 'Ingresos', data: this.datosLogins.map(d => d.total), backgroundColor: '#444' }]
      }
    });
  }

  renderizarGraficoVisitas() {
    if (this.graficoVisitas) this.graficoVisitas.destroy();
    const canvas = document.getElementById('graficoVisitas') as HTMLCanvasElement;
    if (!canvas) return;
    this.graficoVisitas = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: this.datosVisitas.map(d => `${d.nombre} ${d.apellido}`),
        datasets: [{ data: this.datosVisitas.map(d => d.total), backgroundColor: ['#FFC300', '#444', '#888', '#aaa', '#ccc'] }]
      }
    });
  }

  renderizarGraficoLikes() {
    if (this.graficoLikes) this.graficoLikes.destroy();
    const canvas = document.getElementById('graficoLikes') as HTMLCanvasElement;
    if (!canvas) return;
    this.graficoLikes = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.datosLikes.map(d => d._id),
        datasets: [{ label: 'Likes por día', data: this.datosLikes.map(d => d.total), borderColor: '#FFC300', fill: false }]
      }
    });
  }
}