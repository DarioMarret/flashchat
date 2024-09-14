import { GetTokenDecoded } from "function/storeUsuario";
import { BmHttp } from "function/util/global";


export const ControllerListarAgentesCuenta = async () => {
    try {
        const url = `agentes/${GetTokenDecoded().cuenta_id}`
        const {data} = await BmHttp().get(url);
        return data.data
    } catch (error) {
        console.error('Error adding agente:', error);
        return []
    }
};

export const ControllerCrearAgente = async (agente) => {
    try {
        const url = `agentes`
        const { status } = await BmHttp().post(url, agente);
        return status
    } catch (error) {
        console.error('Error adding agente:', error);
        return 400
    }
}


export const ControllerMenuCuenta = async () => {
    try {
        const url = `menu_cuenta?cuenta_id=${GetTokenDecoded().cuenta_id}`
        const {data, status} = await BmHttp().get(url);
        return data.data
    } catch (error) {
        console.error('Error fetching menu agente:', error);
        return []
    }
}