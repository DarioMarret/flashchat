import { GetTokenDecoded } from "function/storeUsuario"
import { BmHttp } from "function/util/global"


export const ControllerServiceMenuAgente = async (agente_id) => {
    try {
        let id = agente_id
        if(!id){
            id= GetTokenDecoded().id
        }
        const url = `menu_agente?agente_id=${id}`
        const { data, status } = await BmHttp().get(url)
        if (status === 200) {
            return data.data
        }else{
            return [] 
        }
    } catch (error) {
        console.log(error)
        return []
    }
}

export const ControllerServiceAsignacionMenuAgente = async (agente_id, menus) => {
    try {
        const url = `asignacion_menu_agente?agente_id=${agente_id}`
        const { status } = await BmHttp().post(url, menus)
        return status
    } catch (error) {
        console.log(error)
        return 500
    }
}