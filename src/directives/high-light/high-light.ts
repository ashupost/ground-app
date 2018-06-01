import { Directive, ElementRef, HostListener, Input } from '@angular/core';


/**
 * Generated class for the HighLightDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[high-light]' // Attribute selector
})
export class HighLightDirective {
  
  constructor(private el: ElementRef) { }

  @Input() defaultHighLightColor: string;

  @Input('high-light') highlightColor: string;

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor || this.defaultHighLightColor || 'red');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
