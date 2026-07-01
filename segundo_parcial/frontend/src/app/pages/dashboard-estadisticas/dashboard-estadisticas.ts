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
  graficoPublicaciones: any = null;
  graficoComentariosTiempo: any = null;
  graficoComentariosPublicacion: any = null;

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
    const hace7dias = new Date();
    hace7dias.setDate(hoy.getDate() - 7);
    this.hasta = hoy.toISOString().split('T')[0];
    this.desde = hace7dias.toISOString().split('T')[0];
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.servEstadisticas.publicacionesPorUsuario(this.desde, this.hasta).subscribe({
      next: (respuesta: any) => {
        this.datosPublicaciones = respuesta;
        this.renderizarGraficoPublicaciones();
      },
      error: (error) => console.error(error)
    });

    this.servEstadisticas.comentariosPorTiempo(this.desde, this.hasta).subscribe({
      next: (respuesta: any) => {
        this.datosComentariosTiempo = respuesta;
        this.renderizarGraficoComentariosTiempo();
      },
      error: (error) => console.error(error)
    });

    this.servEstadisticas.comentariosPorPublicacion(this.desde, this.hasta).subscribe({
      next: (respuesta: any) => {
        this.datosComentariosPublicacion = respuesta;
        this.renderizarGraficoComentariosPublicacion();
      },
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
        datasets: [{ label: 'Publicaciones', data: this.datosPublicaciones.map(d => d.total), backgroundColor: '#444' }]
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
        datasets: [{ data: this.datosComentariosPublicacion.map(d => d.total), backgroundColor: ['#222', '#555', '#888', '#aaa', '#ccc'] }]
      }
    });
  }
}