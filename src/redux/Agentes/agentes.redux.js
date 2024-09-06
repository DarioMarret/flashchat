
const initialState = {
    agenteArray: [],
    agenteMenu: [],
}

export default function agentesReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_AGENTE':
            return {
                ...state,
                agenteArray: action.payload
            }
        case 'GET_MENU_AGENTE':
            return {
                ...state,
                agenteMenu: action.payload
            }
        default:
            return state
    }
}



