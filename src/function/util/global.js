import axios from "axios";
import { GetToken, GetTokenDecoded } from "function/storeUsuario";

export const usuario_local = "usuario:";
export const usuario_token = "token_usuario:";
export const card_mensajes = "card_mensajes:";
export const estaso_nav = "estado:";
export const tabconversacion = "tabconversacion:";
export const conversacion_activa = "conversacion_activa";
export const dev = false;
export const proxy = "backflash"
export const plantillas_360 = "https://waba.360dialog.io/v1/configs/templates?offset=0&limit=1000&sort=business_templates.name&filters={}"
export const host_360 = "https://waba.360dialog.io/v1/messages"
export const host_widget = dev ? "http://localhost:3001/?custom=" : "https://widget.flashchat.chat/?custom="
export const host_sdk = dev ? "http://localhost:8080/main.js" : "https://sdk.flashchat.chat/main.js"
export const host_facturacion = "https://ordenfacil.org/api_facturacion";
export const colorPrimario = "#3F98F8";
// validar si es produccion o desarrollo
const bm = () => {
    let token = GetToken();
    let url = GetTokenDecoded().cuenta.url_dominio;
    if (token === null) {
        Logout()
    }

    return axios.create({
        baseURL: url,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        timeout: 555550000,
    });
};



const Logout = () => {
    localStorage.removeItem(usuario_token)
    localStorage.removeItem(usuario_local)
    localStorage.removeItem(card_mensajes)
    localStorage.removeItem(estaso_nav)
    localStorage.removeItem(tabconversacion)
    localStorage.removeItem(conversacion_activa)
    window.location.href = "/"
}
export const BmHttp = bm;

const dominio = () => {
    if(GetTokenDecoded() === null){
        return  dev ? "https://flash.codigomarret.com/backflash/" : "https://api.flashchat.chat/backflash/";
    }
    return GetTokenDecoded().cuenta.url_dominio
    // return  GetTokenDecoded() && GetTokenDecoded().cuenta.url_dominio ? GetTokenDecoded().cuenta.url_dominio : dev ? "https://flash.codigomarret.com/backflash/" : "https://api.flashchat.chat/backflash/";
}
export const host = dominio;

const httplogin = () => {
    return axios.create({
        baseURL: dev ? "https://flash.codigomarret.com/backflash/" : "https://api.flashchat.chat/backflash/",
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 555550000,
    });
};

export const HoraServer = async() => {
    try {
        let url = dev ?  "https://flash.codigomarret.com/backflash/hora" : "https://api.flashchat.chat/backflash/hora"
        const { data, status } = await axios.get(url)
        if (status === 200) {
            return data;
        }else{
            return null;
        }
    } catch (error) {
        return null;
    }
}

export const HttpLogin = httplogin;
