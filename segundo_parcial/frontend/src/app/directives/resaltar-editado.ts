import { Directive, Input, ElementRef, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[resaltarEditado]',
  standalone: true
})
export class ResaltarEditadoDirective implements OnChanges {
  @Input() resaltarEditado: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    if (this.resaltarEditado) {
      this.renderer.setStyle(this.el.nativeElement, 'border-left', '3px solid #FFC300');
      this.renderer.setStyle(this.el.nativeElement, 'padding-left', '12px');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'border-left');
      this.renderer.removeStyle(this.el.nativeElement, 'padding-left');
    }
  }
}