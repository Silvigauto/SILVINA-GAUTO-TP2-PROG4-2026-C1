import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncar',
  standalone: true
})
export class TruncarPipe implements PipeTransform {
  transform(valor: string, limite: number = 100): string {
    if (!valor) return '';
    if (valor.length <= limite) return valor;
    return valor.substring(0, limite) + '...';
  }
}