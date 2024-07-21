
const initialState = {
    agenteArray: [],
}

export default function agentesReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_AGENTE':
            return {
                ...state,
                agenteArray: action.payload
            }
        default:
            return state
    }
}



