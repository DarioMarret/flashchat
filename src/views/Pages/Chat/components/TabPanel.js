/* eslint-disable react-hooks/exhaustive-deps */


import { GetTokenDecoded } from 'function/storeUsuario';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import { v4 as uuidv4 } from 'uuid';
import { CardChat } from 'views/Pages/CardChat';
import useWindowHeight from './useWindowHeight';

function TabPanel(props) {
    const { agenteArray } = useSelector(state => state.agentes);
    const { verConversacion } = useSelector(state => state.mensajeria);
    const { card_mensajes, misConversaciones, etiquetaSelect } = props;
    const [agentes, setAgentes] = useState(agenteArray);
    const [newCardMensajes, setNewCardMensajes] = useState([]);
    const windowHeight = useWindowHeight();
    const userId = GetTokenDecoded().id; // Suponiendo que tienes una función para obtener el ID del usuario actual


    // Función para cargar los mensajes
    useEffect(() => {
        let filteredMessages;
        switch (misConversaciones) {
            case 'Sin leer':
                filteredMessages = card_mensajes.filter(msg => msg.agente_id === 0);
                break;
            case 'Mias':
                filteredMessages = card_mensajes.filter(msg => msg.agente_id === userId);
                break;
            case 'Todas':
            default:
                filteredMessages = card_mensajes;
                break;
        }
        setNewCardMensajes(filteredMessages);
    }, [card_mensajes, misConversaciones, userId]);

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
    
    const Row = ({ index, style  }) => {
        const item = newCardMensajes[index];
        if (!item || !item.mensaje) return null;

        return (
            <div style={style}>
                <CardChat
                    key={uuidv4()}
                    messageItem={item}
                    // verConversacion={() => ManejarConversacion(item)}
                />
            </div>
        );
    };

    useEffect(() => {
        (async()=>{
            await ListarAgentes()
        })()
    }, [])

    return (
        <div className="w-100 d-flex flex-column gap-3 box-items-chat">
            <List
                height={windowHeight - 150} // Ajusta '150' según los elementos fijos en tu página
                // height={500} 
                width='100%'
                itemSize={200}
                itemCount={newCardMensajes.length}
                itemData={newCardMensajes}
            >
                {Row}
            </List>
            <div className="offside-chat"></div>
        </div>
    );
}

export default TabPanel;