import { DecodeJwt, DescryptCualquierDato } from "./util/ecrypt";
import { usuario_token } from "./util/global";


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