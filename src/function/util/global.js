import axio from "axios";

export const usuario_local = "usuario:";
export const usuario_token = "token_usuario:";
export const card_mensajes = "card_mensajes:";
export const estaso_nav = "estado:";
export const tabconversacion = "tabconversacion:";
export const conversacion_activa = "conversacion_activa";
export const dev = false;
export const host = dev ? "http://localhost:5002/" : "https://api.flashchat.chat/backflash/"
export const proxy = "backflash"
// export const proxy = ""
// export const host = "http://localhost:5002";
export const host_facturacion = "https://ordenfacil.org/api_facturacion";
export const colorPrimario = "#3F98F8";
// validar si es produccion o desarrollo

const bm = new axio.create({
    baseURL: host,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem(usuario_token)
    },
    timeout: 30000
})

export const BmHttp = bm;
