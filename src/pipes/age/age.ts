import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'agePipe',
})
export class AgePipe implements PipeTransform {
  transform(value: string, args) {
    if (!value) return null;
    try {
      let ageDifMs = Date.now() - new Date(value).getTime();
      let ageDate = new Date(ageDifMs); // miliseconds from epoch
      return Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);
    } catch (ex) {
      return null;
    }
  }
}