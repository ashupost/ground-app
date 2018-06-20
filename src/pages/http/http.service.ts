import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HandleError, HttpErrorHandler } from './http-error-handler.service';
import { catchError } from 'rxjs/operators';


export interface Config {
    id: number;
    name: string;
  }

@Injectable()
export class HTTPService {
  private configUrl: string = 'http://localhost:8081/hello';
  private handleError: HandleError;
  
  constructor(private __http: HttpClient, httpErrorHandler: HttpErrorHandler) { 
    this.handleError = httpErrorHandler.createHandleError('HTTPService');
  }

  getUserJava(): Observable<Config[]> {
    return this.__http.get<Config[]>(this.configUrl).pipe(catchError(this.handleError('getUserJava', []))
      );
  }
}


