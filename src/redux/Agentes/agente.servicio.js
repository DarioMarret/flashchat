import { GetTokenDecoded } from "function/storeUsuario";
import { BmHttp } from "function/util/global";
import Swal from "sweetalert2";


export const addAgente = () => async (dispatch) => {
    try {
        const url = `agentes/${GetTokenDecoded().cuenta_id}`
        const {data} = await BmHttp().get(url);
        dispatch({ type: 'ADD_AGENTE', payload: data.data });
    } catch (error) {
        console.error('Error adding agente:', error);
    }
};

export const removeAgente = (id) => async (dispatch) => {
    try {
        await BmHttp().delete(`/api/agentes/${id}`);
        dispatch({ type: 'REMOVE_AGENTE', payload: id });
    } catch (error) {
        console.error('Error removing agente:', error);
    }
};

export const updateAgente = (agente) => async (dispatch) => {
    try {
        const url = `agentes/${agente.id}`
        const { data, status } = await BmHttp().put(url, agente);
        if(status !== 200) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ocurrio un error al actualizar el agente',
            });
        }else{
            Swal.fire({
                icon: 'success',
                title: 'Agente actualizado',
                showConfirmButton: false,
                timer: 1500
            });
            dispatch({ type: 'UPDATE_AGENTE', payload: data.data });
            dispatch({ type: 'SET_MODAL', payload: false });
        }
    } catch (error) {
        console.error('Error updating agente:', error);
    }
};

export const fetchAgentes = () => async (dispatch) => {
    try {
        const url = `agentes/${GetTokenDecoded().cuenta_id}`
        const {data, status} = await BmHttp().get(url);
        if(status !== 200) {
            dispatch({ type: 'GET_AGENTES', payload: [] });
        }else{
            dispatch({ type: 'GET_AGENTES', payload: data.data });
        }
    } catch (error) {
        console.error('Error fetching agentes:', error);
    }
};

export const fetchMenuAgente = () => async (dispatch) => {
    try {
        const url = `menu_cuenta?cuenta_id=${GetTokenDecoded().cuenta_id}`
        const {data, status} = await BmHttp().get(url);
        if(status !== 200) {
            dispatch({ type: 'GET_MENU_AGENTE', payload: [] });
        }else{
            dispatch({ type: 'GET_MENU_AGENTE', payload: data.data });
        }
    } catch (error) {
        console.error('Error fetching menu agente:', error);
    }
}

export const setModalRedux = (modal) => async (dispatch) => {
    dispatch({ type: 'SET_MODAL', payload: modal });
}