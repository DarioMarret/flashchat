import { GetTokenDecoded } from "function/storeUsuario";
import { BmHttp } from "function/util/global";

export const fetchMensajeriaCard = () => async (dispatch) => {
    try {
        const url = `conversacion_card`
        const {data, status} = await BmHttp().post(url,{
            cuenta_id: GetTokenDecoded().cuenta_id,
            
        });
        if(status !== 200) {
            dispatch({ type: 'GET_CARD_MENSAJERIA', payload: [] });
        }else{
            dispatch({ type: 'GET_CARD_MENSAJERIA', payload: data });
        }
    } catch (error) {
        console.error('Error fetching agentes:', error);
    }
};

