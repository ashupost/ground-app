import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'agePipe',
})
export class AgePipe implements PipeTransform {
  transform(value: string, args) {
    if (!value) return null;
    try {
      let ageDifMs = Date.now() - new Date(value).getTime();
      return Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);
    } catch (ex) {
      return null;
    }
  }
}