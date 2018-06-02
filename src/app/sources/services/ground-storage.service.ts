import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class GroundStorageService {
    constructor(private _storage: Storage) {

    }

    async getStorage(key: string) {
        return this._storage.ready().then(() => {
            return this._storage.get(key);
        });
    }

    setStorage(key: string, value: any) {
        this._storage.ready().then(() => {
            this._storage.set(key, value);
        });

    }


}