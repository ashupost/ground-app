import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'relativeTimePipe',
})
export class RelativeTimePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, args) {
    if(!value) return 'NO_TIME';
    return this.timeDifference(new Date(), new Date(value));
  }

  /**
   * @param  {date} current  
   * @param  {date} previous 
   * @return {string}       
   */
  timeDifference(current, previous):string {
    var msPerMinute = 60000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
      if(Math.round(elapsed/1000)<3) return 'At the moment';
      return Math.round(elapsed/1000) + ' sec ago';
    }

    else if (elapsed < msPerHour) {
      return Math.round(elapsed/msPerMinute) + ' min ago';
    }

    else if (elapsed < msPerDay ) {     
      return Math.round(elapsed/msPerHour ) + ' hour ago';
    }


    else if (elapsed < msPerMonth) {
       if(Math.round(elapsed/msPerDay ) ==1)return 'Yesterday at '+previous.getHours()+":"+previous.getMinutes();
       return Math.round(elapsed/msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
      return 'about ' + Math.round(elapsed/msPerMonth) + ' month ago';
    }
    else {
      return this.dateFormat(previous);
    }
  }

dateFormat(value):string{
         return new DatePipe("en-US").transform(value, 'dd-MM-yyyy HH:mm');
    }
}