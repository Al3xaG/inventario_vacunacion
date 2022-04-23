import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Utf8.parse('7061737323313233');
const iv = CryptoJS.enc.Utf8.parse('7061737323313233');

@Injectable({
  providedIn: 'root'
})



export class CryptoService {
 
  constructor() { }

  encrypt(value: string) {
const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

decrypt(value: string) {

const decrypted = CryptoJS.AES.decrypt(value, key, {
    keySize: 128 / 8,
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
});
return decrypted.toString(CryptoJS.enc.Utf8);
}

}
