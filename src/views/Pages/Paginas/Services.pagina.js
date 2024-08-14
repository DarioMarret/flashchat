import { GetTokenDecoded } from "function/storeUsuario";
import { BmHttp } from "function/util/global";


export const ControllerVincularPagina = async (info) => {
    try {
        info.cuenta_id = GetTokenDecoded().cuenta_id;
        const { data, status } = await BmHttp().post('crea_pagina', info);
        return { data, status }
    } catch (error) {
        console.log(error)
    }
}

export const ControllerListarPaginas = async () => {
    try {
        const { data, status } = await BmHttp().get('listar_paginas/'+GetTokenDecoded().cuenta_id);
        return { data, status }
    } catch (error) {
        console.log(error)
    }
}

export const ControllerEliminarPagina = async (id) => {
    try {
        const { data, status } = await BmHttp().delete('eliminar_pagina/'+id);
        return { data, status }
    } catch (error) {
        console.log(error)
    }
}

export const ControllerEditarPagina = async (info) => {
    try {
        const { data, status } = await BmHttp().put('actualizar_pagina', info);
        return { data, status }
    } catch (error) {
        console.log(error)
    }
}
export const ListarPaginasBy = async (id) => {
    try {
        const { data, status } = await BmHttp().get('listar_paginas_by/'+id);
        console.log(data)
        return { data, status }
    } catch (error) {
        console.log(error)
    }
}