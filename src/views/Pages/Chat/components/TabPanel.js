

import { GetTokenDecoded, SetManejoConversacionStorange } from 'function/storeUsuario';
import { BmHttp } from 'function/util/global';
import useMensajeria from 'hook/useMensajeria';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { CardChat } from 'views/Pages/CardChat';
import socket from 'views/SocketIO';

function TabPanel(props) {
    const { card_mensajes, misConversaciones } = props;
    const [agentes, setAgentes] = useState([]);
    const [newCardMensajes, setNewCardMensajes] = useState([]);


    const { historyInfo } = useMensajeria();

    // Función para cargar los mensajes
    const cargarMensajes = () => {
        setNewCardMensajes(card_mensajes);
    };
    useEffect(() => {
        cargarMensajes();
    }, [card_mensajes, misConversaciones])

    const ListarAgentes = async() => {
        const url = `agentes/${GetTokenDecoded().cuenta_id}`
        const { data } = await BmHttp.get(url)
        if (data.status === 200) {
            let ag = []
            data.data.map((agente, index) => {
                ag.push({
                  id: agente.id,
                  cuenta_id: agente.cuenta_id,
                  nombre: agente.nombre,
                })
            })
            setAgentes(ag)
        }else{
          setAgentes([])
        }
    }    

    const NombreAgente = (id) => {
        let nombre = agentes.filter((item) => item.id === id)
        if(nombre.length > 0){
          return nombre[0].nombre
        }else{
          return "Sin agente"
        }
    }
    
    const GetActivaConversacion = async(item) => {
        socket.emit("get_conversacion_activa", {
          cuenta_id: GetTokenDecoded().cuenta_id,
          conversacion_id: item.conversacion_id,
          equipo_id: item.equipo_id,
          channel_id: item.channel_id,
          contacto_id: item.Contactos.id,
          agente_id: GetTokenDecoded().id,
          nombreunico: item.nombreunico,
        })
    }

    const EventoAsignacionAgente = (item) => {
        socket.emit("asignacion_agente", {
          cuenta_id: GetTokenDecoded().cuenta_id,
          contacto_id: item.Contactos.id,
          conversacion_id: item.conversacion_id,
          nombreunico: item.nombreunico,
          agente_id: GetTokenDecoded().id,
        });
    }

    const ManejarConversacion = (item) => {
        if(misConversaciones === 'Todas' && item.agente_id !== 0 && item.agente_id !== GetTokenDecoded().id){
          Swal.fire({
            title: 'Conversación en curso',
            text: 'Esta conversación ya está siendo atendida por el agente *' + NombreAgente(item.agente_id)+'*',
            html: 'Esta conversación ya está siendo atendida por el agente <b className="w-100 text-dark font-bold">' + NombreAgente(item.agente_id)+'</b>',
            icon: 'info',
            confirmButtonText: 'Tomar la conversación',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
          }).then((result) => {
            if (result.isConfirmed) {
              SetManejoConversacionStorange({...item, cuenta_id: GetTokenDecoded().cuenta_id})
              GetActivaConversacion(item)
              EventoAsignacionAgente(item)
              historyInfo()
            }
          })
        }else if(item.agente_id === GetTokenDecoded().id){
          SetManejoConversacionStorange({...item, cuenta_id: GetTokenDecoded().cuenta_id})
          socket.emit("get_conversacion_activa", {
            cuenta_id: GetTokenDecoded().cuenta_id,
            conversacion_id: item.conversacion_id,
            equipo_id: item.equipo_id,
            channel_id: item.channel_id,
            contacto_id: item.Contactos.id,
            agente_id: GetTokenDecoded().id,
            nombreunico: item.nombreunico,
          });
          historyInfo()
        }else{
          SetManejoConversacionStorange({...item, cuenta_id: GetTokenDecoded().cuenta_id})//se guarda en localstorage la conversacion activa
          socket.emit("asignacion_agente", { // se asigna el agente a la conversacion
            cuenta_id: GetTokenDecoded().cuenta_id,
            contacto_id: item.contacto_id,
            conversacion_id: item.conversacion_id,
            nombreunico: item.nombreunico,
            agente_id: GetTokenDecoded().id,
          });
          GetActivaConversacion(item)
          historyInfo()
        }
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
                    if(item.mensaje && item.estado !== "Eliminado" && item.estado !== "Resuelta"){
                        if(item.agente_id === 0){
                            return <CardChat
                                messageItem={item} 
                                index={index}
                                agente={NombreAgente(item.agente_id)}
                                verConversacion={() => ManejarConversacion(item)}
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
                    if(item.mensaje && item.estado !== "Eliminado" && item.estado !== "Resuelta"){
                        if(item.agente_id === GetTokenDecoded().id){
                            return <CardChat 
                                messageItem={item} 
                                index={index}
                                agente={NombreAgente(item.agente_id)}
                                verConversacion={() => ManejarConversacion(item)}
                            />
                        }
                    }
                })}
                <div className="offside-chat"></div>
            </div>
        )
    }else if (misConversaciones === 'Todas'){
        return (
            <div className="w-100 d-flex flex-column gap-3 box-items-chat">
                {newCardMensajes.map((item, index) => {
                    if(item.mensaje && item.estado !== "Eliminado" && item.estado !== "Resuelta"){
                        return (
                            <CardChat 
                                messageItem={item} 
                                index={index}
                                agente={NombreAgente(item.agente_id)}
                                verConversacion={() => ManejarConversacion(item)}
                            />
                        );
                    }
                })}
                <div className="offside-chat"></div>
            </div>
        )
    }else{
        return (
            <div className="w-100 py-2 px-2 d-flex flex-column gap-3 box-items-chat">
                {newCardMensajes.map((item, index) => {
                    if(item.mensaje && item.estado !== "Eliminado" && item.estado !== "Resuelta"){
                        if(item.agente_id === 0){
                            return (
                                <CardChat 
                                    messageItem={item} 
                                    index={index}
                                    agente={NombreAgente(item.agente_id)}
                                    verConversacion={() => ManejarConversacion(item)}
                                />
                            );
                        }
                    }
                })}
                <div className="offside-chat"></div>
            </div>
        )
    }

}

export default TabPanel;