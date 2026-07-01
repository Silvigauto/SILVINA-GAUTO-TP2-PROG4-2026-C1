import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[confirmarAccion]',
  standalone: true
})
export class ConfirmarAccionDirective {
  @Input() mensajeConfirmacion: string = '¿Estás seguro?';
  @Output() accionConfirmada = new EventEmitter<void>();

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    event.stopPropagation();
    const confirmado = confirm(this.mensajeConfirmacion);
    if (confirmado) {
      this.accionConfirmada.emit();
    }
  }
}