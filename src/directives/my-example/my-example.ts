import { Directive } from '@angular/core';

/**
 * Generated class for the MyExampleDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[my-example]' // Attribute selector
})
export class MyExampleDirective {

  constructor() {
    console.log('Hello MyExampleDirective Directive');
  }

}
