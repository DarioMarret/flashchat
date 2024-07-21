import { GetTokenDecoded } from "function/storeUsuario";

const initialState = {
    mensaje_card: [],
    ver_conversacion: [],
    historial: [],
    modal: false,
    pingMensaje: false, //para saber si hay mensajes nuevos
    count: {
        sinLeer: 0,
        misConversaciones: 0,
        todas: 0,
    },
    verConversacion: undefined,
}
const BotEquipos = () => {
    let equipos = []
    let bots = []
    const tokenDecoded = GetTokenDecoded();

    if (tokenDecoded && tokenDecoded.equipos) {
        tokenDecoded.equipos.forEach(item => {
            equipos.push(item.id);
        });
    }

    if (tokenDecoded && tokenDecoded.botId) {
        tokenDecoded.botId.forEach(item => {
            bots.push(item.name);
        });
    }

    return { equipos, bots }
}
const FilterMensajes = (mensajes) => {
    const { equipos, bots } = BotEquipos();
    return mensajes.filter(mensaje => {
        if(equipos.includes(mensaje.equipo_id) && bots.includes(mensaje.nombre_bot)){
            return mensaje
        }
    })
}

export default function mensajeriaReducer(state = initialState, action) {
    try {
        let equipos = []
        let bots = []
        if(GetTokenDecoded() && GetTokenDecoded().equipos !== null){
          GetTokenDecoded().equipos.map((item) => {
            equipos.push(item.id)
          })
        }
        if(GetTokenDecoded() &&  GetTokenDecoded().botId !== null){
          GetTokenDecoded().botId.map((item) => {
            bots.push(item.name)
          })
        }
        switch (action.type) {
            case 'GET_CARD_MENSAJERIA':   //solo este se obtiene de la base de datos mediante un llamdo axios
                let mensajes = FilterMensajes(action.payload)
                return {
                    ...state,
                    mensaje_card: mensajes,
                    pingMensaje: true,
                    count: {
                        sinLeer: mensajes.filter(mensaje => mensaje.agente_id === 0).length,
                        misConversaciones: mensajes.filter(mensaje => mensaje.agente_id === GetTokenDecoded().id).length,
                        todas: mensajes.length
                    }
                }
            case 'SET_CARD_MENSAJERIA':   //se recrea la lista de mensajes
                let mensajes2 = FilterMensajes(action.payload)
                return {
                    ...state,
                    mensaje_card: mensajes2,
                    pingMensaje: true,
                    count: {
                        sinLeer: mensajes2.filter(mensaje => mensaje.agente_id === 0).length,
                        misConversaciones: mensajes2.filter(mensaje => mensaje.agente_id === GetTokenDecoded().id).length,
                        todas: mensajes2.length
                    }
                }
            case 'REEMPLAZAR_MENSAJE_CARD':
                let mensajes3 = FilterMensajes(state.mensaje_card)
                return {
                    ...state,
                    mensaje_card: mensajes3.filter(mensaje => {
                        return !(
                            mensaje.nombreunico === action.payload.nombreunico &&
                            mensaje.conversacion_id === action.payload.conversacion_id &&
                            mensaje.contacto_id === action.payload.contacto_id
                        );
                    }),
                    pingMensaje: true,
                    count: {
                        sinLeer: state.mensaje_card.filter(mensaje => mensaje.agente_id === 0).length,
                        misConversaciones: state.mensaje_card.filter(mensaje => mensaje.agente_id === GetTokenDecoded().id).length,
                        todas: state.mensaje_card.length
                    }
                };
            
            case 'NEW_MENSAJE_OR_REMPLAZAR_MENSAJE_CARD':
                let mensajesFiltrados = FilterMensajes(action.payload, equipos, bots);
                const nuevosMensajes = mensajesFiltrados;
                // Combina los mensajes existentes con los nuevos mensajes, actualizando los existentes
                const mensajesActualizados = state.mensaje_card.map(mensajeExistente => {
                    const mensajeNuevo = nuevosMensajes.find(nuevo => 
                        nuevo.nombreunico === mensajeExistente.nombreunico &&
                        nuevo.conversacion_id === mensajeExistente.conversacion_id &&
                        nuevo.contacto_id === mensajeExistente.contacto_id
                    );
                    return mensajeNuevo ? mensajeNuevo : mensajeExistente;
                });
        
                // Agrega cualquier nuevo mensaje que no esté ya en los mensajes actualizados
                nuevosMensajes.forEach(nuevoMensaje => {
                    if (!mensajesActualizados.some(mensajeActualizado => 
                        mensajeActualizado.nombreunico === nuevoMensaje.nombreunico &&
                        mensajeActualizado.conversacion_id === nuevoMensaje.conversacion_id &&
                        mensajeActualizado.contacto_id === nuevoMensaje.contacto_id
                    )) {
                        mensajesActualizados.push(nuevoMensaje);
                    }
                });
                // Ordenar los mensajes por updatedAt, más reciente primero
                mensajesActualizados.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        
                return {
                    ...state,
                    mensaje_card: mensajesActualizados,
                    pingMensaje: true,
                    count: {
                        sinLeer: mensajesActualizados.filter(mensaje => mensaje.agente_id === 0).length,
                        misConversaciones: mensajesActualizados.filter(mensaje => mensaje.agente_id === GetTokenDecoded().id).length,
                        todas: mensajesActualizados.length
                    }
                };
            case 'REMOVER_MENSAJE_CARD':
                return {
                    ...state,
                    mensaje_card: state.mensaje_card.filter(
                        item => !(item.nombreunico === action.payload.nombreunico &&
                                  item.conversacion_id === action.payload.conversacion_id &&
                                  item.contacto_id === action.payload.contacto_id)
                    ),
                    pingMensaje: true,
                    count: {
                        sinLeer: state.mensaje_card.filter(mensaje => mensaje.agente_id === 0).length,
                        misConversaciones: state.mensaje_card.filter(mensaje => mensaje.agente_id === GetTokenDecoded().id).length,
                        todas: state.mensaje_card.length
                    }
                }
            case 'GET_HISTORIAL':
                return {
                    ...state,
                    historial: action.payload,
                    pingMensaje: true,
                    count: {
                        sinLeer: state.mensaje_card.filter(mensaje => mensaje.agente_id === 0).length,
                        misConversaciones: state.mensaje_card.filter(mensaje => mensaje.agente_id === GetTokenDecoded().id).length,
                        todas: state.mensaje_card.length
                    }
                }
            case 'RESET_PING_MENSAJE':
                return {
                    ...state,
                    pingMensaje: false,
                    count: {
                        sinLeer: state.mensaje_card.filter(mensaje => mensaje.agente_id === 0).length,
                        misConversaciones: state.mensaje_card.filter(mensaje => mensaje.agente_id === GetTokenDecoded().id).length,
                        todas: state.mensaje_card.length
                    }
                }
            case 'SET_HISTORIAL':
                return {
                    ...state,
                    historial: action.payload,
                }
            case 'SET_VER_CONVERSACION':
                return {
                    ...state,
                    ver_conversacion: action.payload,
                }
            case 'VER_CONVERSACION':
                return {
                    ...state,
                    verConversacion: action.payload,
                }
            default:
                return state
        }
    } catch (error) {
        console.error('Error en reducer mensajeria:', error)
    }
}