import axios from "axios";

export const usuario_local = "usuario:";
export const usuario_token = "token_usuario:";
export const card_mensajes = "card_mensajes:";
export const estaso_nav = "estado:";
export const tabconversacion = "tabconversacion:";
export const conversacion_activa = "conversacion_activa";
export const dev = false;
export const host = dev ? "http://localhost:5002/" : "https://api.flashchat.chat/backflash/"
export const proxy = "backflash"
export const plantillas_360 = "https://waba.360dialog.io/v1/configs/templates?offset=0&limit=1000&sort=business_templates.name&filters={}"
export const host_360 = "https://waba.360dialog.io/v1/messages"
export const host_widget = dev ? "http://localhost:3001/?custom=" : "https://widget.flashchat.chat/?custom="
export const host_sdk = dev ? "http://localhost:8080/main.js" : "https://sdk.flashchat.chat/main.js"
export const host_facturacion = "https://ordenfacil.org/api_facturacion";
export const colorPrimario = "#3F98F8";
// validar si es produccion o desarrollo
const bm = new axios.create({
    baseURL: host,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem(usuario_token)
    },
    timeout: 555550000
});

export const BmHttp = bm;
