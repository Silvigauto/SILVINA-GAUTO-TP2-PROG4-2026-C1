import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiempoTranscurrido',
  standalone: true
})
export class TiempoTranscurridoPipe implements PipeTransform {
  transform(fecha: string): string {
    if (!fecha) return '';
    
    const ahora = new Date();
    const fechaPublicacion = new Date(fecha);
    const diferencia = ahora.getTime() - fechaPublicacion.getTime();
    
    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(diferencia / 3600000);
    const dias = Math.floor(diferencia / 86400000);

    if (minutos < 1) return 'hace un momento';
    if (minutos < 60) return `hace ${minutos} minuto${minutos === 1 ? '' : 's'}`;
    if (horas < 24) return `hace ${horas} hora${horas === 1 ? '' : 's'}`;
    return `hace ${dias} día${dias === 1 ? '' : 's'}`;
  }
}