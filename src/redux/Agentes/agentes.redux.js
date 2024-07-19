
const initialState = {
    agentes: [],
    agente_id: 0,
    modal: false,
}

export default function agentesReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_AGENTE':
            return {
                ...state,
                agentes: state.agentes.concat(action.payload)
            }
        case 'REMOVE_AGENTE':
            return {
                ...state,
                agentes: state.agentes.filter( agente => agente.id !== action.payload)
            }
        case 'UPDATE_AGENTE':
            return {
                ...state,
                agentes: state.agentes.map( agente => {
                    if(agente.id === action.payload.id){
                        return action.payload
                    }else{
                        return agente
                    }
                })
            }
        case 'GET_AGENTES':
            return {
                ...state,
                agentes: action.payload
            }
        case 'SET_MODAL':
            return {
                ...state,
                modal: action.payload
            }
        default:
            return state
    }
}



