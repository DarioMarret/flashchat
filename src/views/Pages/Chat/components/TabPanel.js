/* eslint-disable react-hooks/exhaustive-deps */


import { GetTokenDecoded } from 'function/storeUsuario';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { CardChat } from 'views/Pages/CardChat';

function TabPanel(props) {
    const { agenteArray } = useSelector(state => state.agentes);
    const { verConversacion } = useSelector(state => state.mensajeria);
    const { card_mensajes, misConversaciones } = props;
    const [agentes, setAgentes] = useState(agenteArray);
    const [newCardMensajes, setNewCardMensajes] = useState([]);

    // Función para cargar los mensajes
    useEffect(() => {
        setNewCardMensajes(card_mensajes);
    }, [card_mensajes, misConversaciones, verConversacion]);

    const ListarAgentes = async() => {
        let ag = []
        agenteArray.map((agente, index) => {
            ag.push({
                id: agente.id,
                cuenta_id: agente.cuenta_id,
                nombre: agente.nombre,
            })
        })
        setAgentes(ag)
    }
    
    useEffect(() => {
        (async()=>{
            await ListarAgentes()
        })()
    }, [])

    if(misConversaciones === 'Sin leer'){
        return (
            <div className="w-100 d-flex flex-column gap-3 box-items-chat">
                {newCardMensajes.map((item, index) => {
                    if(item.mensaje){
                        if(item.agente_id === 0){
                            return <CardChat
                                key={index}
                                messageItem={item} 
                                index={ uuidv4() }
                                // verConversacion={() => ManejarConversacion(item)}
                            />
                        }
                    }
                })}
                <div className="offside-chat"></div>
            </div>
        )
    }else if (misConversaciones === 'Mias'){
        return (
            <div className="w-100 d-flex flex-column gap-3 box-items-chat">
                {newCardMensajes.map((item, index) => {
                    if(item.mensaje){
                        if(item.agente_id === GetTokenDecoded().id){
                            return <CardChat 
                                key={index}
                                messageItem={item} 
                                index={uuidv4()}
                                // verConversacion={() => ManejarConversacion(item)}
                            />
                        }
                    }
                })}
                <div className="offside-chat"></div>
            </div>
        )
    }else {
        return (
            <div className="w-100 d-flex flex-column gap-3 box-items-chat">
                {newCardMensajes.map((item, index) => {
                    if(item.mensaje){
                        return (
                            <CardChat 
                                key={index}
                                messageItem={item} 
                                index={uuidv4()}
                                // verConversacion={() => ManejarConversacion(item)}
                            />
                        );
                    }
                })}
                <div className="offside-chat"></div>
            </div>
        )
    }

}

export default TabPanel;