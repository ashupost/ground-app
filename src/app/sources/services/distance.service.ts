import { Injectable } from '@angular/core';
import { GeoCordinate } from '../model/userdetails';

@Injectable()
export class DistanceService {
    constructor() { }
    getDistanceByPoint(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((Math.pow((x1 - x2), 2)) + (Math.pow((y1 - y2), 2))) * 113;
    }

    getDistanceByGeoCordinate(x: GeoCordinate, y: GeoCordinate): number {
        if(!x){
            x = new GeoCordinate();
            y = new GeoCordinate();
        }
        if(!y){
            x = new GeoCordinate();
            y = new GeoCordinate();
   
        }
        const x1: number = x.latitude;
        const x2: number = y.latitude;
        const y1: number = x.longitude;
        const y2: number = y.longitude;
        return Math.sqrt((Math.pow((x1 - x2), 2)) + (Math.pow((y1 - y2), 2))) * 113;
    }
}