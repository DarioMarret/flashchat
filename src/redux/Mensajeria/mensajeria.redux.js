const initialState = {
    mensaje_card: [],
    mensaje_activo: [],
    historial: [],
    modal: false,
    pingMensaje: false //para saber si hay mensajes nuevos
}

export default function mensajeriaReducer(state = initialState, action) {
    try {
        switch (action.type) {
            case 'GET_CARD_MENSAJERIA':   //solo este se obtiene de la base de datos mediante un llamdo axios
                return {
                    ...state,
                    mensaje_card: action.payload,
                    pingMensaje: true
                }
            case 'SET_CARD_MENSAJERIA':   //se recrea la lista de mensajes
                return {
                    ...state,
                    mensaje_card: action.payload,
                    pingMensaje: true
                }
            case 'REEMPLAZAR_MENSAJE_CARD':
                return {
                    ...state,
                    mensaje_card: state.mensaje_card.filter(mensaje => {
                        return !(
                            mensaje.nombreunico === action.payload.nombreunico &&
                            mensaje.conversacion_id === action.payload.conversacion_id &&
                            mensaje.contacto_id === action.payload.contacto_id
                        );
                    }),
                    pingMensaje: true
                };
            
            case 'NEW_MENSAJE_OR_REMPLAZAR_MENSAJE_CARD':
                const nuevosMensajes = action.payload;
                // Filtra los mensajes existentes que no deben ser reemplazados
                const mensajesExistentes = state.mensaje_card.filter(item => 
                    !nuevosMensajes.some(item2 => 
                        item.nombreunico === item2.nombreunico &&
                        item.conversacion_id === item2.conversacion_id &&
                        item.contacto_id === item2.contacto_id
                    )
                );
                // Combina los mensajes existentes filtrados con los nuevos mensajes
                const mensajesActualizados = [...mensajesExistentes, ...nuevosMensajes];
                // Ordenar los mensajes por updatedAt, más reciente primero
                mensajesActualizados.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                return {
                    ...state,
                    mensaje_card: mensajesActualizados,
                    pingMensaje: true
                };
    
            case 'REMOVER_MENSAJE_CARD':
                return {
                    ...state,
                    mensaje_card: state.mensaje_card.filter(
                        item => !(item.nombreunico === action.payload.nombreunico &&
                                  item.conversacion_id === action.payload.conversacion_id &&
                                  item.contacto_id === action.payload.contacto_id)
                    ),
                    pingMensaje: true
                }
            case 'GET_HISTORIAL':
                return {
                    ...state,
                    historial: action.payload,
                    pingMensaje: true
                }
            case 'RESET_PING_MENSAJE':
                return {
                    ...state,
                    pingMensaje: false,
                }
            default:
                return state
        }
    } catch (error) {
        console.error('Error en reducer mensajeria:', error);        
    }
}