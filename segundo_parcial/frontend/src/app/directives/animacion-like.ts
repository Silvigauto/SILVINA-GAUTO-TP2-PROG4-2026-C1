import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[animacionLike]',
  standalone: true
})
export class AnimacionLikeDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click')
  onClick() {
    const corazon = this.renderer.createElement('span');
    this.renderer.setStyle(corazon, 'position', 'absolute');
    this.renderer.setStyle(corazon, 'font-size', '24px');
    this.renderer.setStyle(corazon, 'pointer-events', 'none');
    this.renderer.setStyle(corazon, 'animation', 'flotar 1s ease-out forwards');
    this.renderer.setStyle(corazon, 'z-index', '999');
    const texto = this.renderer.createText('❤️');
    this.renderer.appendChild(corazon, texto);

    const padre = this.el.nativeElement.parentElement;
    this.renderer.setStyle(padre, 'position', 'relative');
    this.renderer.appendChild(padre, corazon);

    setTimeout(() => {
      this.renderer.removeChild(padre, corazon);
    }, 1000);
  }
}