import { Injectable } from '@angular/core';
import { GeoCordinate } from '../model/userdetails';

@Injectable()
export class DistanceService {
    constructor() { }
    getDistanceByPoint(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((Math.pow((x1 - x2), 2)) + (Math.pow((y1 - y2), 2))) * 113;
    }

    getDistanceByGeoCordinate(x: GeoCordinate, y: GeoCordinate): number {
        const x1: number = x.latitude;
        const x2: number = y.latitude;
        const y1: number = x.longitude;
        const y2: number = y.longitude;

        if (x1 === 0 || x2 === 0 || y1 === 0 || y2 === 0) {
            return null;
        }
        return Math.sqrt((Math.pow((x1 - x2), 2)) + (Math.pow((y1 - y2), 2))) * 113;
    }
}