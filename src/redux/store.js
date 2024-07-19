import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk'; // Cambiado para importar thunk directamente
import agentesReducer from './Agentes/agentes.redux';
import mensajeriaReducer from './Mensajeria/mensajeria.redux';


const rootReducer = combineReducers({
    agentes: agentesReducer,
    mensajeria: mensajeriaReducer
    // Otros reducers pueden ser añadidos aquí
});


const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);

export default store;