import axios from "axios";
import { GetToken, GetTokenDecoded } from "function/storeUsuario";

export const usuario_local = "flash_usuario:";
export const usuario_token = "flash_token_usuario:";
export const usuario_menu = "flash_menu_usuario:";
export const card_mensajes = "flash_card_mensajes:";
export const estaso_nav = "flash_estado:";
export const tabconversacion = "flash_tabconversacion:";
export const etiquetas = "flash_etiquetas:";
export const conversacion_activa = "flash_conversacion_activa";
export const conversacion_monitoreo = "flash_conversacion_monitoreo";
export const recordatorio_store = "flash_recordatorio";
export const dev = false;
export const proxy = "backflash"
export const plantillas_360 = "https://waba.360dialog.io/v1/configs/templates?offset=0&limit=1000&sort=business_templates.name&filters={}"
export const host_360 = "https://waba.360dialog.io/v1/messages"
export const host_widget = dev ? "http://localhost:3001/?custom=" : "https://widget.flashchat.chat/?custom="
export const host_sdk = dev ? "http://localhost:8080/main.js" : "https://sdk.flashchat.chat/main.js"
export const host_facturacion = "https://ordenfacil.org/api_facturacion";
export const colorPrimario = "#0267ff";
export const colorSecundario = "#f39001";
// validar si es produccion o desarrollo
const bm = () => {
    let token = GetToken();
    let url = GetTokenDecoded() ? GetTokenDecoded().cuenta.url_dominio : "https://api.flashchat.chat/backflash/";
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
    try {
        if(GetTokenDecoded() === null){
            return  dev ? "https://flash.codigomarret.com/backflash/" : "https://api.flashchat.chat/backflash/";
        }else{
            return GetTokenDecoded().cuenta.url_dominio
        }
    } catch (error) {
        console.log(error)
    }
    return  "http://localhost:5002/"
}
export const host = dominio;

const httplogin = () => {
    return axios.create({
        baseURL: dev ? "https://flash.codigomarret.com/backflash/" : "https://api.flashchat.chat/backflash/",
        // baseURL: "http://localhost:5002/",
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
