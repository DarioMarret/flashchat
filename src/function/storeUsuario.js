import axios from 'axios';
import { DecodeJwt, DescryptCualquierDato } from "./util/ecrypt";
import { conversacion_activa, host, usuario_token } from "./util/global";


export const GetToken = () => {
    let token = localStorage.getItem(usuario_token);
    if(token === null){
        return null;
    }else{
        return token;
    }
}

export const GetTokenDecoded = () => {
    let token = localStorage.getItem(usuario_token);
    if(token === null){
        return null;
    }else{
        return DecodeJwt(token);
    }
}

export function setDatosUsuario(data) {
    try {
        // const use = EncryptCualquierDato(strings);
        localStorage.setItem(usuario_token,data)
        return true;
    } catch (error) {
        console.log(error);
    }
}

  
export function getDatosUsuario() {
    try {
        const parse = DescryptCualquierDato(localStorage.getItem(usuario_token))
        if(parse === null){
            return null;
        }
        const datos_usuario = JSON.parse(parse)
        return datos_usuario;
    } catch (error) {
        console.log(error);
    }
}
export function removeDatosUsuario() {
    try {
        localStorage.removeItem(usuario_token)
        return true;
    } catch (error) {
        console.log(error);
    }
}

export const RemoverConversacion = () => {
    localStorage.removeItem("conversacion_activa");
    return true;
}

export const SubirMedia = async (imagen) => {
    const url = `${host}upload`;
    const formData = new FormData();
    formData.append("media", imagen);
    const { data, status } = await axios.post(url, formData);
    console.log(data);
    if (status === 200) {
        return data.url;
    }else{
        return null;
    }
}

export const GetManejoConversacion = () => {
    const local = localStorage.getItem(conversacion_activa);
    if (local) {
      return JSON.parse(local);
    } else {
      return null;
    }
}

export const SetManejoConversacionStorange = (data) => {
    localStorage.setItem(conversacion_activa, JSON.stringify(data));
    return true;
}

export const DeletManejoConversacionStorange = () => {
    localStorage.removeItem(conversacion_activa);
    return true;
}