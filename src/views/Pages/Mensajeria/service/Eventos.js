import { GetTokenDecoded } from "function/storeUsuario"
import Swal from "sweetalert2"
import socket from "views/SocketIO"


export const GetActivaConversacion = async(item) => {
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

export const GetActivaConversacionMonitoreo = (item) => {
  console.log(item)
    socket.emit("get_conversacion_activa", {
      cuenta_id: GetTokenDecoded().cuenta_id,
      conversacion_id: item.conversacion_id,
      equipo_id: item.equipo_id,
      channel_id: item.channel_id,
      contacto_id: item.Contactos.id,
      agente_id: item.agente_id,
      nombreunico: item.nombreunico,
    })
}

export const EventoAsignacionAgente = (item) => {
    socket.emit("asignacion_agente", {
      cuenta_id: GetTokenDecoded().cuenta_id,
      contacto_id: item.Contactos.id,
      conversacion_id: item.conversacion_id,
      nombreunico: item.nombreunico,
      agente_id: GetTokenDecoded().id,
    });
}

export const EmiittingMensaje = () => {
    socket.emit("listar_conversacion", {
      cuenta_id: GetTokenDecoded().cuenta_id,
      equipo_id: null,
      agente_id: GetTokenDecoded().id,
      estado: null,
    })
}

export const EmittMesnaje = (infoClient, mensaje) => {
    socket.emit("enviando_mensajes", {
        infoClient: infoClient,
        mensaje: mensaje,
    });
}

export const ChatLiberado = (data) => {
  socket.emit("liberar_chat", {
    cuenta_id: GetTokenDecoded().cuenta_id,
    contacto_id: data.contacto_id,
    conversacion_id: data.conversacion_id,
    nombreunico: data.nombreunico,
    agente_id: data.agente_id,
    agente_libera: GetTokenDecoded().nombre,
  })
  Swal.fire({
    icon: 'success',
    title: 'Chat liberado',
    showConfirmButton: false,
    timer: 1500
  })
  socket.emit("borrar_conversacion", {
    agente_id: GetTokenDecoded().id,
  })
}

export const SetTransferirChat = (data, agente_id) => {
  socket.emit("transferir_chat", {
    cuenta_id: GetTokenDecoded().cuenta_id,
    agente_transferir: GetTokenDecoded().nombre,
    contacto_id: data.contacto_id,
    conversacion_id: data.conversacion_id,
    agente_id: agente_id,
  });
}

export const random = () => {
  return Math.random().toString(36).substr(2);
}