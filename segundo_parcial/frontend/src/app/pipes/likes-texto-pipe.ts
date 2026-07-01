import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'likesTexto',
  standalone: true
})
export class LikesTextoPipe implements PipeTransform {
  transform(cantidad: number): string {
    if (cantidad === 0) return '¡Sin likes todavía!';
    if (cantidad <= 3) return `${cantidad} like${cantidad === 1 ? '' : 's'}`;
    if (cantidad <= 5) return `+${cantidad} likes`;
    return `+${cantidad} likes, ¡qué popular!`;
  }
}