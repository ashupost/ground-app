import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addressPipe',
})
export class AddressPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {

    return value.toLowerCase();
  }
}
