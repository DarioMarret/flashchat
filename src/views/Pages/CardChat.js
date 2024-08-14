import { GetManejoConversacion, GetTokenDecoded, SetManejoConversacionStorange } from 'function/storeUsuario';
import { BmHttp, colorPrimario, tabconversacion } from 'function/util/global';
import useMensajeria from 'hook/useMensajeria';
import { useState } from 'react';
import {
  Modal
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import socket from 'views/SocketIO';

function CardChat(props) {
  const dispatch = useDispatch();
  const { agenteArray } = useSelector(state => state.agentes);
  // const { mensaje_card, ver_conversacion, historial, pingMensaje } = useSelector(state => state.mensajeria);
  const { index, messageItem, verConversacion } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { historyInfo, verHistorial } = useMensajeria();

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [show, setShow] = useState(false);
  const [agentes, setAgentes] = useState(agenteArray)
  const [agente_id, setAgente_id] = useState(0)


  const ManejarConversacion = () => {
    if(messageItem.agente_id !== 0  && messageItem.agente_id !== GetTokenDecoded().id){
      Swal.fire({
        title: 'Conversación en curso',
        text: 'Esta conversación ya está siendo atendida por el agente *' + NombreAgente(messageItem.agente_id)+'*',
        html: 'Esta conversación ya está siendo atendida por el agente <b className="w-100 text-dark font-bold">' + NombreAgente(messageItem.agente_id)+'</b>',
        icon: 'info',
        confirmButtonText: 'Tomar la conversación',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          SetManejoConversacionStorange({...messageItem, cuenta_id: GetTokenDecoded().cuenta_id})
          GetActivaConversacion(messageItem)
          EventoAsignacionAgente(messageItem)
          historyInfo()
        }
      })
    }else if(messageItem.agente_id === GetTokenDecoded().id){
      SetManejoConversacionStorange({...messageItem, cuenta_id: GetTokenDecoded().cuenta_id})
      socket.emit("get_conversacion_activa", {
        cuenta_id: GetTokenDecoded().cuenta_id,
        conversacion_id: messageItem.conversacion_id,
        equipo_id: messageItem.equipo_id,
        channel_id: messageItem.channel_id,
        contacto_id: messageItem.Contactos.id,
        agente_id: GetTokenDecoded().id,
        nombreunico: messageItem.nombreunico,
      });
      dispatch({ type: 'SET_HISTORIAL', payload: [] });
      dispatch({ type: 'SET_VER_CONVERSACION', payload: [] });
      historyInfo()
    }else{
      SetManejoConversacionStorange({...messageItem, cuenta_id: GetTokenDecoded().cuenta_id})//se guarda en localstorage la conversacion activa
      socket.emit("asignacion_agente", { // se asigna el agente a la conversacion
        cuenta_id: GetTokenDecoded().cuenta_id,
        contacto_id: messageItem.contacto_id,
        conversacion_id: messageItem.conversacion_id,
        nombreunico: messageItem.nombreunico,
        agente_id: GetTokenDecoded().id,
      });
      dispatch({ type: 'SET_HISTORIAL', payload: [] });
      dispatch({ type: 'SET_VER_CONVERSACION', payload: [] });
      GetActivaConversacion(messageItem)
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
    historyInfo()
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

  const ChatLiberado = (data) => {
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

  const SetTransferirChat = (data) => {
    console.log("SetTransferirChat: ", data)
    socket.emit("transferir_chat", {
      cuenta_id: GetTokenDecoded().cuenta_id,
      agente_transferir: GetTokenDecoded().nombre,
      contacto_id: data.contacto_id,
      conversacion_id: data.conversacion_id,
      agente_id: agente_id,
    });
  }

  const ListarAgentes = () => {
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

  const NombreAgente = (id) => {
    let nombre = agentes.filter((item) => item.id === id)
    if(nombre.length > 0){
      return nombre[0].nombre
    }else{
      return "Sin agente"
    }
  }

  const VerConversacionesSinAsignar = (items) => {
    let data = {
      ...items,
      sin_asignar: true,
    }
    SetManejoConversacionStorange(data)
    socket.emit("get_conversacion_activa", {
      cuenta_id: GetTokenDecoded().cuenta_id,
      conversacion_id: items.conversacion_id,
      equipo_id: items.equipo_id,
      channel_id: items.channel_id,
      contacto_id: items.contacto_id,
      agente_id: items.agente_id,
      nombreunico: items.nombreunico,
      tipo: "sin_asignar",
    })
    dispatch({type: 'SET_HISTORIAL', payload: []})
    historyInfo()
    
  }

  const RemoverEtiqueta = async (etiqueta, et) => {
    const { data } = await BmHttp().post(`conversacion_etiqueta`, {
        cuenta_id: GetTokenDecoded().cuenta_id,
        conversacion_id: etiqueta.conversacion_id,
        contacto_id: etiqueta.contacto_id,
        nombreunico: etiqueta.nombreunico,
        etiqueta: et,
        accion: 'remover'
    })
    if (data.status === 200) {
      historyInfo()
      let covActiva = GetManejoConversacion();
      covActiva.etiquetas_estado = data.data.etiquetas_estado
      socket.emit("listar_conversacion", {
        cuenta_id: GetTokenDecoded().cuenta_id,
        equipo_id: null,
        agente_id: GetTokenDecoded().id,
        estado: null,
      })
      SetManejoConversacionStorange(covActiva)
    }
  }

  const GetTab = () => {
    return localStorage.getItem(tabconversacion)
  }

  useState(() => {
    ListarAgentes()
  },[])

  return (
    <>
      <div key={index + 1} className="chat-item rounded w-100">
        <div className="w-100 rounded px-2 rounded-1 rounded-bottom-0 d-flex justify-content-between align-items-center" 
        style={{ 
          // backgroundColor: "#3F98F8",
          backgroundColor: GetTab() === 'Mias' ? (messageItem.leido  ? "#2CBCEE" : "#57B94D") :  colorPrimario ,
          color: "white",
          fontSize: "13px" }}>
            <span>{ messageItem.bot +" - "+messageItem.telefono }</span>
            <span>#{ messageItem.conversacion_id }</span>
        </div>

        <div className="d-flex gap-2 align-items-center p-2 cursor-pointer" 
          onClick={() => {
            if(GetTab() === 'Mias'){
              ManejarConversacion()
            }else{
              VerConversacionesSinAsignar(messageItem)
            }
          }}>
          <div className="w-25 d-flex flex-column align-items-center justify-content-center">
            <div className="w-25 rounded d-flex align-items-center justify-content-center">
                <img src={ messageItem.url_avatar } className="rounded-circle" width="50px" height="50px"/>
            </div>
          </div>

          <div className="w-75 p-1 d-flex flex-column">
            <div className="d-flex flex-column justify-content-between">
              <span className="w-100 text-dark font-bold text-start" 
              style={{ fontSize: '14px' }}>
                { messageItem.name }
              </span>

              <div className="w-100 d-flex justify-content-between">
                <small 
                  className="text-warning" 
                  style={{ fontSize: '12px' }}>{messageItem.fecha}</small>
                  {messageItem.leido}
              </div>
            </div>

            <div className="d-flex flex-row justify-content-between my-1" 
            style={{ lineHeight: '17px'}}>
              <small className="text-dark"
                //cuando pase el mouse mostrar el mensaje completo
                data-toggle="tooltip"
                data-placement="top"
                title={messageItem.mensaje.type === "text" ? messageItem.mensaje.text : null}
              >
                {
                  // limitar la cantidad de caracteres a mostrar
                  messageItem.mensaje.type === "text"
                    ? String(messageItem.mensaje.text).length > 30
                      ? String(messageItem.mensaje.text).substring(0, 30) +
                        "..."
                      : messageItem.mensaje.text
                    : // si es imagen o video mostrar el tipo de archivo
                    messageItem.mensaje.type === "image" ?
                    <i className="fas fa-file-image"></i>
                    : // si es video mostrar el tipo de archivo
                      messageItem.mensaje.type === "video"
                    ? 
                    //icono de una video
                     <i className="fas fa-file-video"></i>
                    : // si es audio mostrar el nombre del archivo
                    messageItem.mensaje.type === "audio"
                    ? <i className="fas fa-file-audio"></i>
                    : // si es archivo mostrar el nombre del archivo
                    messageItem.mensaje.type === "file"
                    ? <i className="fas fa-file"></i>
                    : null
                }
              </small>
            </div>
          </div>
        </div>

        <div className="border-top w-100"></div>
        
        <div className="w-100 rounded px-2 my-2 rounded-1 rounded-top-0" 
          style={{ fontSize: "13px" }}>
          <div className="d-flex gap-2 flex-wrap mt-1">
              { messageItem.etiqueta.map((et, index) => {
                if (et !== null && et !== "" && et !== undefined){
                  return (
                    <span
                      key={index + 1}
                      className="chat-tag rounded bg-gray text-white"
                    >
                      {et}
                    </span>
                  );
                }
              })}
            <span className="w-20 text-dark font-bold"
              style={{ fontSize: "12px" }}
            >
              Ag: {NombreAgente(messageItem.agente_id)}
            </span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="w-20 text-dark font-bold"
              style={{ fontSize: "12px" }}
            >
              Etiqueta: {" "}
              {
                messageItem.etiquetas_estado !== null ?
                  messageItem.etiquetas_estado.map((et, index) => {
                    if (et !== null && et !== "" && et !== undefined){
                      return (
                        <span
                          key={index + 1}
                          className="chat-tag rounded text-white"
                          style={{ background: et.color }}
                        >
                          <i className="fas fa-times-circle"
                            onClick={() => RemoverEtiqueta(messageItem, et)}
                            style={{ cursor: 'pointer' }}
                          ></i>
                          {et.etiquetas}
                        </span>
                      );
                    }
                  }): null
              }
            </span>
            
          </div>
        </div>
      </div>
      <Modal
        show={show}
        onHide={() => setShow(!show)+setAgente_id(0)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {/* Listar a que agente le quiere transfer el chat */}
        <Modal.Header closeButton>
          <Modal.Title>Transferir chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column gap-2">
            {
              // datos del chat
              messageItem && messageItem.name !== undefined ?
              <div className="d-flex gap-2">
                <span className="text-dark">Usuario:</span>
                <span className="text-dark font-bold">{messageItem.name}</span>
              </div>
              : null
            }
            {
              // bots
              messageItem && messageItem.bot !== undefined ?
              <div className="d-flex gap-2">
                <span className="text-dark">Bot:</span>
                <span className="text-dark font-bold">{messageItem.bot}</span>
              </div>
              : null
            }
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => setAgente_id(parseInt(e.target.value))}
              >
                <option value="0">Seleccione un agente</option>
                {
                  agentes && agentes.length > 0 ?
                  agentes.map((agente, index) => {
                      return (
                        <option key={index + 1} value={agente.id}>
                          {agente.nombre}
                        </option>
                      );
                    }): null
                }
              </select>

              <button
                className="btn btn-primary"
                onClick={() => SetTransferirChat(messageItem)}
              >
                Transferir
              </button>


          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export { CardChat };
