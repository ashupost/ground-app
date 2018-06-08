
import firebase from 'firebase';

export interface PageInterface {
    title: string;
    pageName: string;
    tabComponent?: any;
    index?: number;
    icon: string;
  }
  

export class PictureDetail {
    photoType: PhotoStatus;
    dataType: string;
    data: any;
    timestamp: firebase.firestore.FieldValue;
    uid: string;
    
}

export enum PhotoStatus {
    MAIN = "MAIN",
    NOT_MAIN = "NOT_MAIN",
}



export class UserDetails {
    docId: string;
    uid: string;
    name: string;
    email: string;
    gender: string;
    age: number;
    timestamp: firebase.firestore.FieldValue;
    photoURL: string;
    accountType: string;
    latitude: number;
    longitude: number;
    status: string;
    address: AddressUser;
}

export class GeoCordinate {
    docId: string
    latitude: number = 0;
    longitude: number = 0;
    timestamp: firebase.firestore.FieldValue
} 

export enum UserStatus {
    ONLINE = "secondary",
    OFFLINE = "danger",
    DISCONNECT = "light",
    SIGNOUT = "danger",
    IDLE = "light"
    
}

export interface OnlineStatus{
    status: string,
    timestamp: firebase.firestore.FieldValue
}

export interface AddressUser {
    street: string,
    city: string,
    state: string,
    country: string,
    country_iso_code: string,
    formatted_address: string
}
