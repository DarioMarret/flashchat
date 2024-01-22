import { Base64 } from 'js-base64';
import { jwtDecode } from "jwt-decode";

export function EncryptCualquierDato(data){
    return Base64.encode(data)
}
export function DescryptCualquierDato(data){
    if(data === null || data === undefined){
        return null;
    }
    return Base64.decode(data)
}

export const DecodeJwt = (token) => {
    try {
        return jwtDecode(token);
    } catch (error) {
        return null;
    }
}